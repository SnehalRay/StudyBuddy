package com.postgresql.studybuddy.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="files")

public class File {
    @Id
    @Column(unique = true, nullable = false)
    private String id;


    private String name;

    @Column(name = "s3_key")
    private String s3Key;

    @ManyToOne
    @JoinColumn(name="folder_id")
    private Folder folder;


}
