package com.backend.service.book;

import com.backend.domain.book.Book;
import com.backend.domain.book.Kdc;
import com.backend.mapper.book.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
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
        book.setMemberId(Integer.valueOf(auth.getName()));
        mapper.insertBook(book);
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

        return Map.of("boardList", mapper.selectAllPaging(offset, kdc, type, keyword), "pageInfo", pageInfo);
    }
}
