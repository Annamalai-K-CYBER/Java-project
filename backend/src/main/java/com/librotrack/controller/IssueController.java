package com.librotrack.controller;

import com.librotrack.dto.IssueRequestDTO;
import com.librotrack.dto.ReturnRequestDTO;
import com.librotrack.dto.ApiResponse;
import com.librotrack.dto.IssuedBookDTO;
import com.librotrack.entity.IssueRecord;
import com.librotrack.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    
    @PostMapping
    public ResponseEntity<ApiResponse> issueBook(@Valid @RequestBody IssueRequestDTO issueRequestDTO) {
        ApiResponse response = issueService.issueBook(issueRequestDTO);
        return ResponseEntity.ok(response);
    }

    
    @PostMapping("/return")
    public ResponseEntity<ApiResponse> returnBook(@Valid @RequestBody ReturnRequestDTO returnRequestDTO) {
        ApiResponse response = issueService.returnBook(returnRequestDTO);
        return ResponseEntity.ok(response);
    }

    
    @GetMapping
    public ResponseEntity<List<IssueRecord>> getAllIssueRecords() {
        return ResponseEntity.ok(issueService.getAllIssueRecords());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<IssueRecord> getIssueRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueRecordById(id));
    }

    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<IssueRecord>> getIssuedBooksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(issueService.getIssuedBooksByStudent(studentId));
    }

    
    @GetMapping("/student/{studentId}/current")
    public ResponseEntity<List<IssueRecord>> getCurrentIssuedBooksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(issueService.getCurrentlyIssuedBooksByStudent(studentId));
    }

    
    @GetMapping("/issued")
    public ResponseEntity<List<IssuedBookDTO>> getCurrentlyIssuedBooks() {
        return ResponseEntity.ok(issueService.getCurrentlyIssuedBooksDTO());
    }
}
