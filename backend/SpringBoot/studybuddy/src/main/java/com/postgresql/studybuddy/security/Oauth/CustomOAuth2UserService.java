package com.postgresql.studybuddy.security.Oauth;


import com.postgresql.studybuddy.entity.User;
import com.postgresql.studybuddy.repository.UserRepo;
import com.postgresql.studybuddy.security.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;



//http://localhost:8080/oauth2/authorization/google
@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest){
        OAuth2User oAuthUser = super.loadUser(userRequest);

        String email = oAuthUser.getAttribute("email");
        String name = oAuthUser.getAttribute("name");

        Optional<User> userOptional = userRepo.findByEmail(email);

        if (userOptional.isEmpty()){
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name);
            userRepo.save(newUser);
        }

        String token = jwtUtils.generateToken(email);
        // Optionally, log or store token — but better: pass it to frontend via redirect or cookie


        return oAuthUser; // ✅ This is returned regardless (so existing users = **login**)

    }
}
