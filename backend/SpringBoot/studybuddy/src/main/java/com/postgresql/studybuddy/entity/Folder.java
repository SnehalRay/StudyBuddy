package com.postgresql.studybuddy.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "folders")

public class Folder {
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String awsDirectory;


}
