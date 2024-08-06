package com.backend.service.book;

import com.backend.domain.book.Book;
import com.backend.domain.book.BookImage;
import com.backend.domain.book.BookLoan;
import com.backend.domain.book.Kdc;
import com.backend.mapper.book.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BookService {
    private final BookMapper mapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void addBook(Authentication auth, Book book, MultipartFile[] files) throws IOException {
        mapper.insertBook(book);
        mapper.insertBookTransactions(book.getId(), Integer.valueOf(auth.getName()), book.getQuantity());

        if (files != null) {
            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();
                mapper.insertImage(book.getId(), fileName);

                String key = STR."prj4/\{book.getId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }

    public boolean validate(Book book) {
        if (book.getKdcId() == null || book.getKdcId() < 0) {
            return false;
        }
        if (book.getIsbn() == null || book.getIsbn().isEmpty()) {
            return false;
        }
        if (book.getTitle() == null || book.getTitle().isEmpty()) {
            return false;
        }
        if (book.getAuthor() == null || book.getAuthor().isEmpty()) {
            return false;
        }
        if (book.getPublisher() == null || book.getPublisher().isEmpty()) {
            return false;
        }

        return true;
    }

    public boolean isExist(Integer id) {
        if (mapper.selectById(id) != null) {
            return true;
        }
        return false;
    }

    public Map<String, Object> getKdc() {
        Map<String, Object> kdc = new HashMap<>();

        List<Kdc> main = mapper.selectKdcMain();
        List<Kdc> sub = mapper.selectKdcSub();

        kdc.put("main", main);
        kdc.put("sub", sub);

        return kdc;
    }

    public boolean checkIsbn(String isbn) {
        if (mapper.selectByIsbn(isbn.trim()) == null) {
            return true;
        } else {
            return false;
        }
    }

    public Map<String, Object> list(Integer page, Integer kdc, String type, String keyword) {
        Map<String, Object> pageInfo = new HashMap<>();
        Integer countAll = mapper.countAllWithSearch(kdc, type, keyword);

        Integer offset = (page - 1) * 10;
        Integer lastPageNum = (countAll - 1) / 10 + 1;
        Integer beginPageNum = (page - 1) / 10 * 10 + 1;
        Integer endPageNum = beginPageNum + 9;
        endPageNum = Math.min(endPageNum, lastPageNum);

        Integer prevPageNum = beginPageNum - 1;
        Integer nextPageNum = endPageNum + 1;

        if (prevPageNum > 0) {
            pageInfo.put("prevPageNum", prevPageNum);
        }
        if (nextPageNum <= lastPageNum) {
            pageInfo.put("nextPageNum", nextPageNum);
        }
        pageInfo.put("currPageNum", page);
        pageInfo.put("lastPageNum", lastPageNum);
        pageInfo.put("beginPageNum", beginPageNum);
        pageInfo.put("endPageNum", endPageNum);

        List<Book> bookList = new ArrayList<>();

        if (kdc != null && kdc % 10 == 0) {
            for (int i = 0; i < 10; i++) {
                bookList.addAll(mapper.selectAllPaging(offset, kdc + i, type, keyword));
            }
        } else {
            bookList = mapper.selectAllPaging(offset, kdc, type, keyword);
        }

        for (Book book : bookList) {
            String fileName = mapper.selectImageNameByBookId(book.getId());
            BookImage image = new BookImage(fileName, STR."\{srcPrefix}\{book.getId()}/\{fileName}");
            book.setBookImage(image);
        }

        return Map.of("bookList", bookList, "pageInfo", pageInfo);
    }

    public Book get(Integer id) {
        Book book = mapper.selectById(id);

        String fileName = mapper.selectImageNameByBookId(id);
        BookImage image = new BookImage(fileName, STR."\{srcPrefix}\{id}/\{fileName}");
        book.setBookImage(image);

        return book;
    }

    public void editBook(Authentication auth, Book book, MultipartFile[] files) throws IOException {
        if (files != null && files.length > 0) {
            String oldKey = STR."prj4/\{book.getId()}/\{mapper.selectImageNameByBookId(book.getId())}";
            DeleteObjectRequest oldObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(oldKey)
                    .build();
            s3Client.deleteObject(oldObjectRequest);

            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();
                mapper.updateImage(book.getId(), fileName);

                String newKey = STR."prj4/\{book.getId()}/\{fileName}";
                PutObjectRequest newObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(newKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(newObjectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
        Integer prevQuantity = mapper.selectQuantityByBookId(book.getId());
        mapper.updateBook(book);
        mapper.insertBookTransactions(book.getId(), Integer.valueOf(auth.getName()), book.getQuantity() - prevQuantity);
    }

    public void removeBook(Integer id, Authentication auth) {
        String key = STR."prj4/\{id}/\{mapper.selectImageNameByBookId(id)}";
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(objectRequest);

        mapper.deleteImageByBookId(id);
        // TODO: 대여 정보 삭제
        mapper.insertBookTransactions(id, Integer.valueOf(auth.getName()), -mapper.selectSumChangesByBookId(id));
        mapper.deleteBookById(id);
    }

    public boolean borrowable(Integer id) {
        if (mapper.selectQuantityByBookId(id) > 0) {
            return true;
        }
        return false;
    }

    public void borrowBook(Integer id, Authentication auth) {
        Integer memberId = Integer.valueOf(auth.getName());
        mapper.insertBookLoan(id, memberId);
//        mapper.insertBookTransactions(id, memberId, -1);
        mapper.updateBookQuantity(id, -1);
    }

    public boolean isBorrow(Integer id, Authentication auth) {
        if (mapper.selectBookLoanId(id, Integer.valueOf(auth.getName())) != null && mapper.selectReturnDate(id, Integer.valueOf(auth.getName())) == null) {
            return true;
        }
        return false;
    }

    public void returnBook(Integer id, Integer memberId) {
        mapper.updateBookQuantity(id, 1);
        mapper.updateReturnDateAtBookLoan(id, memberId);
//        mapper.insertBookTransactions(id, memberId, 1);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void autoReturnBook() {
        List<BookLoan> dueBookList = mapper.selectBookLoanIdNotReturned();
        for (BookLoan dueBook : dueBookList) {
            returnBook(dueBook.getId(), dueBook.getMemberId());
        }
    }
}
