package com.backend.domain.member;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Member {
    private Integer id;
    private String email;
    private String password;
    private String name;
    private Integer gender;
    private String tel;
    private String address;
    private LocalDate birth;
    private LocalDateTime inserted;
}
