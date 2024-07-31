package com.backend.domain.book;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Book {
    private Integer id;
    private Integer kdcId;
    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private String publicationYear;
    private String description;
    private Integer quantity;
    private LocalDateTime inserted;

    private String kdcMain;
    private String kdcSub;
    private BookImage bookImage;
}
