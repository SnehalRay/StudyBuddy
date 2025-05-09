package com.postgresql.studybuddy.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;
    private String password;
    @Column(unique = true)
    private String email;
}
