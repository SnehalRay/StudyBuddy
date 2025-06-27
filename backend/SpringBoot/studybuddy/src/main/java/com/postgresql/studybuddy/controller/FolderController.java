package com.postgresql.studybuddy.controller;


import com.postgresql.studybuddy.entity.Folder;
import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.repository.FolderRepo;
import com.postgresql.studybuddy.repository.UserRepo;
import com.postgresql.studybuddy.security.JwtUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import java.util.List;
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

            // 3. Check if a folder with the same name exists for this user
            boolean folderExists = folderRepo.existsByNameAndOwner(folder.getName(), userOptional.get());
            if (folderExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Folder with that name already exists.");
            }

            folder.setOwner(userOptional.get());
            folder.setId(generateUniqueFolderID());

            folderRepo.save(folder);

            //lets do the cookie thing
            String folderString = folder.getName() + "#" + email;
            String encodedFolderString = URLEncoder.encode(folderString, StandardCharsets.UTF_8);

            ResponseCookie folderCookie = ResponseCookie.from("folderSession", encodedFolderString)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(60 * 60)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body("Folder created with ID: "+folder.getId());





        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating folder:"+e.getMessage());
        }
    }

    /***
     * The purpose of this request function is to encode a cookie which has folder name + email address to get a unique string which can be easy to encode
     * @param folderId
     * @param request
     * @param response
     * @return
     */
    @PostMapping("/open")
    public ResponseEntity<?> openFolder(@RequestParam String folderId, HttpServletRequest request, HttpServletResponse response){
        try {

            //Step 1: Extract token from cookies
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

            // Step 3: Check folder
            Optional<Folder> folderOptional = folderRepo.findById(folderId);
            if (folderOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found.");
            }

            Folder folder = folderOptional.get(); //get the folder object
            if (!folder.getOwner().getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this folder.");
            }

            //STEP 4: Encode name#email into cookie
            String folderString = folder.getName() + "#" + email;
            String encodedFolderString = URLEncoder.encode(folderString, StandardCharsets.UTF_8);

            ResponseCookie folderCookie = ResponseCookie.from("folderSession", encodedFolderString)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(60 * 60)
                    .build();


            response.setHeader("Set-Cookie", folderCookie.toString());
            return ResponseEntity.ok("Folder opened and session set.");



        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error opening folder" + e.getMessage());
        }
    }

    @PostMapping("/exitFolder")
    public ResponseEntity<?> exitFolder(HttpServletResponse response){
        //Create a new cookie with the same name and set max age to 0 for deletion
        ResponseCookie deleteCookie = ResponseCookie.from("folderSession","")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.setHeader("Set-Cookie",deleteCookie.toString());

        return ResponseEntity.ok("Folder session exited. Cookie deleted.");
    }

    // This method will return the entire list of folders the user has created to populate the frontend

    @GetMapping("/listFolders")
    public ResponseEntity<?>    getAllFolders(HttpServletRequest request) {
        // Extract JWT from cookies
        String token = null;
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                // Prevents NPE by replacing cookie.getName().equals("jwt")
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // Validating the token to authorize the user
        if (token == null || !jwtUtils.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or missing JWT");
        }

        // Identify the user
        String email = jwtUtils.extractEmail(token);
        var userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        // Load the folders by owner
        List<Folder> folders = folderRepo.findByOwner(userOpt.get());

        // Return as JSON
        return ResponseEntity.ok(folders);
    }






    private String generateUniqueFolderID(){
        String id;
        do {
            id = UUID.randomUUID().toString().replace("-","").substring(0,10);
        } while (folderRepo.existsById(id));
        return id;
    }


}
