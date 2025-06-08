package com.postgresql.studybuddy.controller;

import com.postgresql.studybuddy.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service){
        this.s3Service = s3Service;
    }

    @PostMapping("/upload/files")
    public ResponseEntity<String> upload(@RequestParam("file")MultipartFile file){
        try{
            String filename = file.getOriginalFilename();
            s3Service.uploadFile(filename, file);
            return ResponseEntity.ok("Uploaded: "+filename);

        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("Upload failed");
        }
    }
}
