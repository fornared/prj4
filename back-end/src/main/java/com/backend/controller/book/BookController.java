package com.backend.controller.book;

import com.backend.domain.book.Book;
import com.backend.service.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {
    private final BookService service;

    @PostMapping("add")
    @PreAuthorize("hasAnyAuthority('SCOPE_admin', 'SCOPE_manager')")
    public ResponseEntity add(Authentication auth, Book book, @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(book)) {
            service.addBook(auth, book, files);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("get/kdc")
    public Map<String, Object> getKdc() {
        return service.getKdc();
    }

    @GetMapping("check")
    public boolean check(@RequestParam String isbn) {
        return service.checkIsbn(isbn);
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") Integer page,
                                    @RequestParam(required = false) Integer kdc,
                                    @RequestParam(required = false) String type,
                                    @RequestParam(required = false) String keyword) {
        return service.list(page, kdc, type, keyword);
    }

    @GetMapping("{id}")
    public ResponseEntity get(@PathVariable Integer id) {
        if (service.isExist(id)) {
            return ResponseEntity.ok(service.get(id));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("edit")
    @PreAuthorize("hasAnyAuthority('SCOPE_admin', 'SCOPE_manager')")
    public ResponseEntity edit(Authentication auth, Book book, @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(book)) {
            service.editBook(auth, book, files);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_admin', 'SCOPE_manager')")
    public void delete(@PathVariable Integer id, Authentication auth) {
        service.removeBook(id, auth);
    }

    @PostMapping("{id}/borrow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity borrow(@PathVariable Integer id, Authentication auth) {
        if (service.borrowable(id)) {
            service.borrowBook(id, auth);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("{id}/borrow")
    @PreAuthorize("isAuthenticated()")
    public boolean isBorrow(@PathVariable Integer id, Authentication auth) {
        return service.isBorrow(id, auth);
    }

    @PutMapping("{id}/return")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity returnBook(@PathVariable Integer id, Authentication auth) {
        if (service.isBorrow(id, auth)) {
            Integer memberId = Integer.valueOf(auth.getName());
            service.returnBook(id, memberId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("library")
    @PreAuthorize("isAuthenticated()")
    public List<Book> getMyBooks(Authentication auth) {
        return service.getMyBooks(auth);
    }
}
