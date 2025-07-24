package com.postgresql.studybuddy.security.Oauth;

import com.postgresql.studybuddy.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.util.Base64;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // ✅ Generate JWT token
        String token = jwtUtils.generateToken(email);
        String encodedToken = Base64.getUrlEncoder().encodeToString(token.getBytes()); // ✅ Encode for cookie

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", encodedToken)
                .httpOnly(true)
                .secure(false) // true in prod
                .path("/")
                .sameSite("Lax")
                .maxAge(86400)
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        // ✅ Redirect to frontend without sensitive info in URL
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/oauth2/redirect");
    }
}
