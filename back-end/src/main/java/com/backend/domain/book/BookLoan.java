package com.backend.domain.book;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookLoan {
    private Integer id;
    private Integer memberId;
    private Integer bookId;
    private LocalDate loanDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
}
