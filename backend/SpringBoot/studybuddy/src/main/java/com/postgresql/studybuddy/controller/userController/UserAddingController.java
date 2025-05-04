package com.postgresql.studybuddy.controller.userController;


import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class UserAddingController {

    @Autowired
    UserRepo userRepo;

    @PostMapping("/addUser")
    public void addUser(@RequestBody User user){
        userRepo.save(user);

    }
}
