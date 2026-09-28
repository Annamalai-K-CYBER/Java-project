package com.librotrack.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDTO {

    private Long id;
    private String title;
    private String author;
    private String isbn;
    private int totalCopies;
    private int availableCopies;
    private String category;
}
