package com.postgresql.studybuddy.repository;

import com.postgresql.studybuddy.entity.VoiceCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoiceCharacterRepo extends JpaRepository<VoiceCharacter,Long> {
    Optional<VoiceCharacter> findByElevenLabsId(String elevenLabsId);
}
