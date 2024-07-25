package com.backend.domain.book;

import lombok.Data;

@Data
public class BookImage {
    private Integer id;
    private Integer bookId;
    private String name;
    private String url;
}
