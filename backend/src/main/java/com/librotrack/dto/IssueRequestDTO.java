package com.librotrack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueRequestDTO {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotNull(message = "Student ID is required")
    private Long studentId;
}
