package com.postgresql.studybuddy.repository;

import com.postgresql.studybuddy.entity.Folder;
import com.postgresql.studybuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepo extends JpaRepository<Folder, String > {

    // Optional: find folder by name
    Optional<Folder> findByName(String name);

    // Optional: find all folders owned by a specific user
    List<Folder> findByOwner(User owner);

    boolean existsByNameAndOwner(String name, User owner);

    Optional<Folder> findByNameAndOwner(String name, User owner);


}
