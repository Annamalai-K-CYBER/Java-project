package com.librotrack.service;

import com.librotrack.dto.BookRequestDTO;
import com.librotrack.dto.BookResponseDTO;
import com.librotrack.entity.Book;
import com.librotrack.exception.ResourceNotFoundException;
import com.librotrack.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    
    public BookResponseDTO addBook(BookRequestDTO bookRequestDTO) {
        Book book = new Book(
            bookRequestDTO.getTitle(),
            bookRequestDTO.getAuthor(),
            bookRequestDTO.getIsbn(),
            bookRequestDTO.getTotalCopies(),
            bookRequestDTO.getCategory()
        );
        Book savedBook = bookRepository.save(book);
        return convertToResponseDTO(savedBook);
    }

    
    public BookResponseDTO updateBook(Long id, BookRequestDTO bookRequestDTO) {
        Book existingBook = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        existingBook.setTitle(bookRequestDTO.getTitle());
        existingBook.setAuthor(bookRequestDTO.getAuthor());
        existingBook.setIsbn(bookRequestDTO.getIsbn());
        existingBook.setTotalCopies(bookRequestDTO.getTotalCopies());
        existingBook.setCategory(bookRequestDTO.getCategory());

        
        if (bookRequestDTO.getTotalCopies() > existingBook.getTotalCopies()) {
            int diff = bookRequestDTO.getTotalCopies() - existingBook.getTotalCopies();
            existingBook.setAvailableCopies(existingBook.getAvailableCopies() + diff);
        }

        Book updatedBook = bookRepository.save(existingBook);
        return convertToResponseDTO(updatedBook);
    }

    
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    
    public List<BookResponseDTO> getAllBooks() {
        return bookRepository.findAll().stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    
    public List<BookResponseDTO> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title).stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    
    public List<BookResponseDTO> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author).stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    
    public List<BookResponseDTO> searchByCategory(String category) {
        return bookRepository.findByCategory(category).stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    
    public BookResponseDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return convertToResponseDTO(book);
    }

    
    private BookResponseDTO convertToResponseDTO(Book book) {
        return new BookResponseDTO(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getIsbn(),
            book.getTotalCopies(),
            book.getAvailableCopies(),
            book.getCategory()
        );
    }
}
