package com.postgresql.studybuddy.repository;

import com.postgresql.studybuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); //finding the users through their email
    Optional<User> findByUsername(String username); //finding the users through their username
}
