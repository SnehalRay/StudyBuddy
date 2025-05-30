package com.postgresql.studybuddy.security;

import com.postgresql.studybuddy.security.Oauth.CustomOAuth2UserService;
import com.postgresql.studybuddy.security.Oauth.OAuth2LoginSuccessHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


/**
 * This tells the password encoder configuration to use @Bean
 * @Bean = method that returns an object which will be managed by Spring's container
 *
 * If Bean is not used, you manage it easily
 */

@Slf4j
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    /**
     * This method defines a custom security filter chain.
     *
     * - Spring Security normally protects *all* endpoints by default.
     * - This configuration overrides that and allows certain routes (like /signup and /login) to be public.
     *
     * Breakdown:
     * - csrf().disable():
     *     - Disables Cross Site Request Forgery protection.
     *     - Usually needed only for browser-based apps with cookies. Since you're using JSON APIs (e.g., Postman or React), disabling it is okay for now.
     *
     * - authorizeHttpRequests():
     *     - Starts customizing which endpoints are allowed without authentication.
     *
     * - requestMatchers("/signup", "/login").permitAll():
     *     - Lets users access /signup and /login routes without needing to log in.
     *
     * - anyRequest().authenticated():
     *     - All other routes require authentication (will respond with 401 if accessed without it).
     *
     * - formLogin().disable():
     *     - Disables Spring Security's default login HTML form.
     *     - You’re building a REST API, so you want JSON-based login, not an HTML login page.
     *
     * - return http.build():
     *     - Finalizes and builds the security filter chain with all these rules.
     */

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2LoginSuccessHandler successHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("/signup", "/login","/logout","/verifyToken","/folder/create","/folder/open","/folder/exitFolder","/upload/files","/file/upload").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .userInfoEndpoint()
                .userService(customOAuth2UserService) // use your custom service
                .and()
                .successHandler(successHandler);

        // ✅ Apply JWT filter outside of the oauth2Login() chain
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
}
