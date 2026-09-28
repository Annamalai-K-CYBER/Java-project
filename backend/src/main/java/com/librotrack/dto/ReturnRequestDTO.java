package com.librotrack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequestDTO {

    @NotNull(message = "Issue record ID is required")
    private Long issueId;

    private java.time.LocalDate returnDate;
}
