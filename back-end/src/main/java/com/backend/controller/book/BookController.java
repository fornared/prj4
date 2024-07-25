package com.backend.controller.book;

import com.backend.domain.book.Book;
import com.backend.service.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {
    private final BookService service;

    @PostMapping("add")
    @PreAuthorize("hasAnyAuthority('SCOPE_admin', 'SCOPE_manager')")
    public ResponseEntity add(Authentication auth, Book book, @RequestParam(value = "files", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(book)) {
            service.addBook(auth, book, files);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
