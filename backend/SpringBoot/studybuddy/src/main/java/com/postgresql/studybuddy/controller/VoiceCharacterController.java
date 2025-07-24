package com.postgresql.studybuddy.controller;


import com.postgresql.studybuddy.entity.VoiceCharacter;
import com.postgresql.studybuddy.repository.VoiceCharacterRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voiceCharacter")
public class VoiceCharacterController {

    @Autowired
    VoiceCharacterRepo voiceCharacterRepo;

    /**
     * This is an API Request to add Voices to the website
     *
     * */

    @PostMapping("/addVoices")
    public ResponseEntity<Map<String, String>> addVoices(@RequestBody VoiceCharacter voiceCharacter){
        try{

            boolean voiceIdExists = voiceCharacterRepo.findByElevenLabsId(voiceCharacter.getElevenLabsId()).isPresent();

            if (voiceIdExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Voice already exists."));
            }

            voiceCharacterRepo.save(voiceCharacter);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Voice Added successful");
            response.put("name", voiceCharacter.getName());
            response.put("Eleven Labs Id", voiceCharacter.getElevenLabsId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response); //success response in json


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error occurred: " + e.getMessage())); //if some other issues, then it says the error
        }
    }
}
