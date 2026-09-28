package com.librotrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "issue_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnDate;

    private double fineAmount;

    
    public IssueRecord(Book book, Student student) {
        this.book = book;
        this.student = student;
        this.issueDate = LocalDate.now();
        this.dueDate = LocalDate.now().plusDays(14);
        this.returnDate = null;
        this.fineAmount = 0.0;
    }
}
