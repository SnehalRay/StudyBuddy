package com.postgresql.studybuddy.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="characters")
public class VoiceCharacter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String elevenLabsId;
}
