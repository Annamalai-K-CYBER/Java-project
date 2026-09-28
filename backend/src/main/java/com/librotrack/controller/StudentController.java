package com.librotrack.controller;

import com.librotrack.dto.StudentRequestDTO;
import com.librotrack.dto.StudentResponseDTO;
import com.librotrack.dto.ApiResponse;
import com.librotrack.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    
    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentByEmail(
            studentService.getAllStudents().stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .map(StudentResponseDTO::getEmail)
                .orElse("")
        ));
    }

    
    @PostMapping
    public ResponseEntity<StudentResponseDTO> addStudent(@Valid @RequestBody StudentRequestDTO studentRequestDTO) {
        StudentResponseDTO createdStudent = studentService.addStudent(studentRequestDTO);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDTO studentRequestDTO) {
        StudentResponseDTO updatedStudent = studentService.updateStudent(id, studentRequestDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    
    @GetMapping("/email/{email}")
    public ResponseEntity<StudentResponseDTO> getStudentByEmail(@PathVariable String email) {
        return ResponseEntity.ok(studentService.getStudentByEmail(email));
    }

    
    @GetMapping("/studentId/{studentId}")
    public ResponseEntity<StudentResponseDTO> getStudentByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentByStudentId(studentId));
    }
}
