package com.librotrack.service;

import com.librotrack.dto.IssueRequestDTO;
import com.librotrack.dto.ReturnRequestDTO;
import com.librotrack.dto.ApiResponse;
import com.librotrack.dto.IssuedBookDTO;
import com.librotrack.entity.Book;
import com.librotrack.entity.IssueRecord;
import com.librotrack.entity.Student;
import com.librotrack.exception.ResourceNotFoundException;
import com.librotrack.exception.BusinessRuleViolationException;
import com.librotrack.repository.BookRepository;
import com.librotrack.repository.IssueRecordRepository;
import com.librotrack.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssueService {

    
    private static final double FINE_RATE = 1.0;

    
    private static final int ISSUE_DAYS = 14;

    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;
    private final IssueRecordRepository issueRecordRepository;

    public IssueService(BookRepository bookRepository, StudentRepository studentRepository,
                        IssueRecordRepository issueRecordRepository) {
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
        this.issueRecordRepository = issueRecordRepository;
    }

    
    @Transactional
    public ApiResponse issueBook(IssueRequestDTO issueRequestDTO) {
        Long bookId = issueRequestDTO.getBookId();
        Long studentId = issueRequestDTO.getStudentId();

        
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        
        if (book.getAvailableCopies() <= 0) {
            throw new BusinessRuleViolationException(
                "Cannot issue book '" + book.getTitle() + "'. All copies are already checked out."
            );
        }

        
        IssueRecord issueRecord = new IssueRecord(book, student);
        issueRecord.setDueDate(issueRecord.getIssueDate().plusDays(ISSUE_DAYS));

        
        issueRecordRepository.save(issueRecord);

        
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return ApiResponse.success(
            "Book '" + book.getTitle() + "' issued to " + student.getName() +
            ". Due date: " + issueRecord.getDueDate(),
            issueRecord
        );
    }

    
    @Transactional
    public ApiResponse returnBook(ReturnRequestDTO returnRequestDTO) {
        Long issueId = returnRequestDTO.getIssueId();
        LocalDate returnDate = returnRequestDTO.getReturnDate() != null
            ? returnRequestDTO.getReturnDate()
            : LocalDate.now();

        
        IssueRecord issueRecord = issueRecordRepository.findById(issueId)
            .orElseThrow(() -> new ResourceNotFoundException("Issue record not found with id: " + issueId));

        
        if (issueRecord.getReturnDate() != null) {
            throw new BusinessRuleViolationException(
                "Book has already been returned on " + issueRecord.getReturnDate()
            );
        }

        
        double fineAmount = calculateFine(issueRecord, returnDate);
        issueRecord.setFineAmount(fineAmount);
        issueRecord.setReturnDate(returnDate);
        issueRecordRepository.save(issueRecord);

        
        Book book = issueRecord.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        String message = "Book '" + book.getTitle() + "' returned successfully.";
        if (fineAmount > 0) {
            message += " Fine of $" + String.format("%.2f", fineAmount) + " applied for " +
                (returnDate.toEpochDay() - issueRecord.getDueDate().toEpochDay()) + " day(s) late.";
        }

        return ApiResponse.success(message, issueRecord);
    }

    
    private double calculateFine(IssueRecord issueRecord, LocalDate returnDate) {
        long daysLate = java.time.temporal.ChronoUnit.DAYS.between(issueRecord.getDueDate(), returnDate);
        if (daysLate > 0) {
            return daysLate * FINE_RATE;
        }
        return 0.0;
    }

    
    public List<IssueRecord> getCurrentlyIssuedBooks() {
        return issueRecordRepository.findByReturnDateNull();
    }

    public List<IssuedBookDTO> getCurrentlyIssuedBooksDTO() {
        return issueRecordRepository.findByReturnDateNull().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private IssuedBookDTO convertToDTO(IssueRecord record) {
        IssuedBookDTO dto = new IssuedBookDTO();
        dto.setId(record.getId());
        dto.setIssueDate(record.getIssueDate());
        dto.setDueDate(record.getDueDate());
        dto.setReturnDate(record.getReturnDate());
        if (record.getReturnDate() != null) {
            dto.setFineAmount(record.getFineAmount());
        } else {
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
            dto.setFineAmount(daysLate > 0 ? daysLate * FINE_RATE : 0.0);
        }
        if (record.getBook() != null) {
            dto.setBookId(record.getBook().getId());
            dto.setBookTitle(record.getBook().getTitle());
            dto.setBookAuthor(record.getBook().getAuthor());
        }
        if (record.getStudent() != null) {
            dto.setStudentId(record.getStudent().getId());
            dto.setStudentName(record.getStudent().getName());
        }
        return dto;
    }

    
    public List<IssueRecord> getIssuedBooksByStudent(Long studentId) {
        return issueRecordRepository.findByStudentId(studentId);
    }

    
    public List<IssueRecord> getCurrentlyIssuedBooksByStudent(Long studentId) {
        return issueRecordRepository.findByStudentIdAndReturnDateNull(studentId);
    }

    
    public List<IssueRecord> getAllIssueRecords() {
        return issueRecordRepository.findAll();
    }

    
    public IssueRecord getIssueRecordById(Long id) {
        return issueRecordRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Issue record not found with id: " + id));
    }

    
    public double getFineRate() {
        return FINE_RATE;
    }

    
    public int getIssueDays() {
        return ISSUE_DAYS;
    }
}
