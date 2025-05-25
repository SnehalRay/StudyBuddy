package com.postgresql.studybuddy.controller;


import com.postgresql.studybuddy.entity.Folder;
import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.repository.FolderRepo;
import com.postgresql.studybuddy.repository.UserRepo;
import com.postgresql.studybuddy.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/folder")
public class FolderController {

    private final FolderRepo folderRepo;
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;

    @PostMapping("/create")
    public ResponseEntity<?> createFolder(@RequestBody Folder folder, HttpServletRequest request){
        try{

            //First we will extract the cookie
            String token = null;
            if (request.getCookies()!= null){
                for (var cookie: request.getCookies()){
                    if (cookie.getName().equals("jwt")){
                        token = cookie.getValue();
                        break;
                    }
                }
            }

            if (token == null || !jwtUtils.validateToken(token)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
            }

            String email = jwtUtils.extractEmail(token);
            Optional<User> userOptional = userRepo.findByEmail(email);

            folder.setOwner(userOptional.get());
            folder.setId(generateUniqueFolderID());

            folderRepo.save(folder);
            return ResponseEntity.status(HttpStatus.CREATED).body("Folder created with ID: "+folder.getId());





        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating folder:"+e.getMessage());
        }
    }

    private String generateUniqueFolderID(){
        String id;
        do {
            id = UUID.randomUUID().toString().replace("-","").substring(0,10);
        } while (folderRepo.existsById(id));
        return id;
    }


}
