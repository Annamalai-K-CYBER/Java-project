package com.librotrack.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String studentId;
}
