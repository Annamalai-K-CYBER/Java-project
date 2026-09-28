package com.librotrack.repository;

import com.librotrack.entity.IssueRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {

    List<IssueRecord> findByStudentId(Long studentId);

    List<IssueRecord> findByBookId(Long bookId);

    List<IssueRecord> findByStudentIdAndReturnDateNull(Long studentId);

    List<IssueRecord> findByReturnDateNull();
}
