package com.postgresql.studybuddy.repository;

import com.postgresql.studybuddy.entity.File;
import com.postgresql.studybuddy.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepo extends JpaRepository<File, String> {

    //Find all the files based on the folder ID
    List<File> findByFolder(Folder folder);
}
