package com.librotrack.service;

import com.librotrack.dto.StudentRequestDTO;
import com.librotrack.dto.StudentResponseDTO;
import com.librotrack.entity.Student;
import com.librotrack.exception.ResourceNotFoundException;
import com.librotrack.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    
    public StudentResponseDTO addStudent(StudentRequestDTO studentRequestDTO) {
        Student student = new Student();
        student.setName(studentRequestDTO.getName());
        student.setEmail(studentRequestDTO.getEmail());
        student.setStudentId(studentRequestDTO.getStudentId());
        Student savedStudent = studentRepository.save(student);
        return convertToResponseDTO(savedStudent);
    }

    
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO studentRequestDTO) {
        Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        existingStudent.setName(studentRequestDTO.getName());
        existingStudent.setEmail(studentRequestDTO.getEmail());
        existingStudent.setStudentId(studentRequestDTO.getStudentId());

        Student updatedStudent = studentRepository.save(existingStudent);
        return convertToResponseDTO(updatedStudent);
    }

    
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    
    public StudentResponseDTO getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
        return convertToResponseDTO(student);
    }

    
    public StudentResponseDTO getStudentByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with student ID: " + studentId));
        return convertToResponseDTO(student);
    }

    
    private StudentResponseDTO convertToResponseDTO(Student student) {
        return new StudentResponseDTO(
            student.getId(),
            student.getName(),
            student.getEmail(),
            student.getStudentId()
        );
    }
}
