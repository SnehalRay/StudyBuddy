package com.postgresql.studybuddy.controller.userController;



import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.security.JwtUtils;
import com.postgresql.studybuddy.repository.UserRepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController

public class UserAddingController {

    @Autowired
    UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;


    /**
     * This is an API Call to make sign up requests
     *
     * @return
     * HTTP response entity
     */

    @PostMapping("/signup")
    public ResponseEntity<Map<String,String>> signupUser(@RequestBody User user){

        try {

            //first we check if user exists
            boolean userExists = userRepo.findByEmail(user.getEmail()).isPresent(); //checks if an exsisting username or email exists

            if (userExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists with that email."));
                //return http response of it being a fail cuz of conflict aka code 409
            }

            //now as the user is new, we hash their password
            String hashedPassword = passwordEncoder.encode(user.getPassword()); //we use it to hash the password and get a string
            user.setPassword(hashedPassword); //sets the user's password as the hashed password
            userRepo.save(user); //saves it and inserts it into the database

            //Generate JWT token
            String cookieString = jwtUtils.generateToken(user.getEmail());


            Map<String, String > response = new HashMap<>();
            response.put("message", "Signup successful");
            response.put("token", cookieString);
            response.put("email", user.getEmail());


            return ResponseEntity.status(HttpStatus.CREATED).header(HttpHeaders.SET_COOKIE, cookieString).body(response); //success response in json



        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error occurred: " + e.getMessage())); //if some other issues, then it says the error
        }
    }

    /**
     *
     * This is a function to help logging in from the backend
     *
     */

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){

        try{

            Optional<User> existingUser = userRepo.findByEmail(user.getEmail()); //getting the user based on their email

            if (existingUser.isEmpty()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User does not exist"); //409 conflict
            }
            User beingAccessedUser = existingUser.get(); //considering we have the matched user, this is the user object


            if (!passwordEncoder.matches(user.getPassword(), beingAccessedUser.getPassword())){
                //checking if the password is correct. Password encoder ensures to see the hashed and unhashed
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Password incorrect"); //409 conflict

            }


            //Generate jwt token

            String cookieString = jwtUtils.generateToken(user.getEmail());

//            return ResponseEntity.status(HttpStatus.CREATED).body(user.getUsername() + " is logged in"); //success response in json

            // Return JWT token in response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", cookieString);
            response.put("email", beingAccessedUser.getEmail());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookieString)
                    .body(response);  // your response map with "message", "email", etc.


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred: " + e.getMessage()); //if some other issues, then it says the error
        }
    }

    @GetMapping("/verifyToken")
    public ResponseEntity<String> verifyToken(HttpServletRequest request) {
        // Get all cookies
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();

                    if (jwtUtils.validateToken(token)) {
                        String email = jwtUtils.extractEmail(token);
                        Optional<User> user = userRepo.findByEmail(email);

                        if (user.isPresent()) {
                            String username = user.get().getUsername();
                            return ResponseEntity.ok("Token is valid. Logged in as: " + username);
                        } else {
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                        }

                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
                    }
                }
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("JWT cookie not found");
    }



}
