package com.postgresql.studybuddy.controller;


import com.postgresql.studybuddy.entity.File;
import com.postgresql.studybuddy.entity.Folder;
import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.repository.FileRepo;
import com.postgresql.studybuddy.repository.FolderRepo;
import com.postgresql.studybuddy.repository.UserRepo;
import com.postgresql.studybuddy.security.JwtUtils;
import com.postgresql.studybuddy.service.S3Service;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")

public class FileController {

    private final FolderRepo folderRepo;
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;
    private final FileRepo fileRepo;
    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFileToFolder(@RequestParam("file")MultipartFile file, HttpServletRequest request){
        try{
            //First we will extract the cookie
            String token = null;
            String folderToken = null;

            if (request.getCookies()!= null){
                for (var cookie: request.getCookies()){
                    if (cookie.getName().equals("jwt")){
                        token = cookie.getValue();

                    } else if (cookie.getName().equals("folderSession")) {
                        folderToken = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);

                    }
                }
            }

            if (token == null || !jwtUtils.validateToken(token)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
            }

            if (folderToken == null || !folderToken.contains("#")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or missing folder session.");
            }

            String email = jwtUtils.extractEmail(token);


            //now we get the folder string which is: folder.getName() + "#" + email;
            String[] folderParts = folderToken.split("#");
            String folderName = folderParts[0];
            String folderOwnerEmail = folderParts[1];

            if (!email.equals(folderOwnerEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to upload to this folder.");
            }

            Optional<User> userOptional = userRepo.findByEmail(email);
            Optional<Folder> folderOptional = folderRepo.findByNameAndOwner(folderName, userOptional.get());

            if (folderOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found.");
            }

            Folder folder = folderOptional.get(); //getting the folder object

            //upload to s3
            String fileId = UUID.randomUUID().toString().replace("-","").substring(0,12);
            String s3Key = folder.getId() + "/" + file.getOriginalFilename() +"-"+ userOptional.get().getEmail();
            s3Service.uploadFile(s3Key, file); //name, file

            //Save file metadeta
            File fileEntity = new File();
            fileEntity.setId(fileId);
            fileEntity.setName(file.getOriginalFilename());
            fileEntity.setS3Key(s3Key);
            fileEntity.setFolder(folder);

            fileRepo.save(fileEntity);

            return ResponseEntity.ok("File uploaded with ID: " + fileId);



        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload error: " + e.getMessage());
        }

    }

    /**
     *
     * List files of a folder (folder => derived from the cookie
     *
     * */
    @GetMapping("/listFiles")
    public ResponseEntity<?> listFilesInFolder(HttpServletRequest request) {
        // Use folderSession/JWT to fetch files for the current user and folder
        // Return a list of File metadata (e.g., name, id, s3Key)

        //First we will extract the cookie
        String token = null;
        String folderToken = null;

        if (request.getCookies()!= null){
            for (var cookie: request.getCookies()){
                if (cookie.getName().equals("jwt")){
                    token = cookie.getValue();

                } else if (cookie.getName().equals("folderSession")) {
                    folderToken = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);

                }
            }
        }

        if (token == null || !jwtUtils.validateToken(token)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
        }

        if (folderToken == null || !folderToken.contains("#")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or missing folder session.");
        }

        String email = jwtUtils.extractEmail(token);


        //now we get the folder string which is: folder.getName() + "#" + email;
        String[] folderParts = folderToken.split("#");
        String folderName = folderParts[0];
        String folderOwnerEmail = folderParts[1];

        if (!email.equals(folderOwnerEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to upload to this folder.");
        }

        Optional<User> userOptional = userRepo.findByEmail(email);
        Optional<Folder> folderOptional = folderRepo.findByNameAndOwner(folderName, userOptional.get());

        if (folderOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found.");
        }

        Folder folder = folderOptional.get(); //getting the folder object

        //fetch files from repo
        List<File> files = fileRepo.findByFolder(folder);

        // Return only basic file info (DTO)
        List<Map<String, String>> result = files.stream().map(f -> Map.of(
                "id", f.getId(),
                "name", f.getName(),
                "s3Key", f.getS3Key()
        )).toList();

        return ResponseEntity.ok(result);

    }
}
