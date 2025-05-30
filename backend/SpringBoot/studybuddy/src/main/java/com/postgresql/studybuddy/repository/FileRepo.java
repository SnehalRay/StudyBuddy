package com.postgresql.studybuddy.repository;

import com.postgresql.studybuddy.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepo extends JpaRepository<File, String> {
}
