package com.librotrack.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuedBookDTO {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private Long studentId;
    private String studentName;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private double fineAmount;
}
