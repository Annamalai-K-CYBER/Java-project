package com.librotrack.controller;

import com.librotrack.dto.BookRequestDTO;
import com.librotrack.dto.BookResponseDTO;
import com.librotrack.dto.ApiResponse;
import com.librotrack.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    
    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    
    @PostMapping
    public ResponseEntity<BookResponseDTO> addBook(@Valid @RequestBody BookRequestDTO bookRequestDTO) {
        BookResponseDTO createdBook = bookService.addBook(bookRequestDTO);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDTO bookRequestDTO) {
        BookResponseDTO updatedBook = bookService.updateBook(id, bookRequestDTO);
        return ResponseEntity.ok(updatedBook);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted successfully", null));
    }

    
    @GetMapping("/search/title/{title}")
    public ResponseEntity<List<BookResponseDTO>> searchByTitle(@PathVariable String title) {
        return ResponseEntity.ok(bookService.searchByTitle(title));
    }

    
    @GetMapping("/search/author/{author}")
    public ResponseEntity<List<BookResponseDTO>> searchByAuthor(@PathVariable String author) {
        return ResponseEntity.ok(bookService.searchByAuthor(author));
    }

    
    @GetMapping("/search/category/{category}")
    public ResponseEntity<List<BookResponseDTO>> searchByCategory(@PathVariable String category) {
        return ResponseEntity.ok(bookService.searchByCategory(category));
    }
}
