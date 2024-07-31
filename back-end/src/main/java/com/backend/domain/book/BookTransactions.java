package com.backend.domain.book;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookTransactions {
    private Integer id;
    private Integer bookId;
    private Integer memberId;
    private Integer changes;
    private LocalDateTime updated;
}
