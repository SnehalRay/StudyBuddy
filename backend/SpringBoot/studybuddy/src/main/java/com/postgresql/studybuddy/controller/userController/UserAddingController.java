package com.postgresql.studybuddy.controller.userController;



import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<String> signupUser(@RequestBody User user){

        try {

            //first we check if user exists
            boolean userExists = userRepo.findByEmail(user.getEmail()).isPresent() || userRepo.findByEmail(user.getUsername()).isPresent(); //checks if an exsisting username or email exists

            if (userExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists with that email or username.");
                //return http response of it being a fail cuz of conflict aka code 409
            }

            //now as the user is new, we hash their password
            String hashedPassword = passwordEncoder.encode(user.getPassword()); //we use it to hash the password and get a string
            user.setPassword(hashedPassword); //sets the user's password as the hashed password
            userRepo.save(user); //saves it and inserts it into the database
            return ResponseEntity.status(HttpStatus.CREATED).body("user is created:" + user.getUsername()); //success response in json



        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred: " + e.getMessage()); //if some other issues, then it says the error
        }
    }

    /**
     *
     * This is a function to help logging in from the backend
     *
     */

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user){

        try{

            Optional<User> existingUser = userRepo.findByUsername(user.getUsername()); //getting the user based on their username

            if (existingUser.isEmpty()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User does not exist"); //409 conflict
            }
            User beingAccessedUser = existingUser.get(); //considering we have the matched user, this is the user object


            if (!passwordEncoder.matches(user.getPassword(), beingAccessedUser.getPassword())){
                //checking if the password is correct. Password encoder ensures to see the hashed and unhashed
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Password incorrect"); //409 conflict

            }

            return ResponseEntity.status(HttpStatus.CREATED).body(user.getUsername() + " is logged in"); //success response in json


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred: " + e.getMessage()); //if some other issues, then it says the error
        }
    }

}
