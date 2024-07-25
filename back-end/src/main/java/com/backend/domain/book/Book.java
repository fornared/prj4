package com.backend.domain.book;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Book {
    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private String title;
    private String author;
    private String publisher;
    private String publishedDate;
    private String description;
    private String isbn;
    private LocalDateTime inserted;
}
