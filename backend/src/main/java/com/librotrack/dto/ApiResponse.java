package com.librotrack.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private String message;
    private Object data;
    private String status;

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(message, data, "SUCCESS");
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(message, null, "ERROR");
    }
}
