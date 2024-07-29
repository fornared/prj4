package com.backend.domain.book;

import lombok.Data;

@Data
public class Kdc {
    private Integer id;
    private String classCode;
    private String name;

    private Integer kdcMainId;
}
