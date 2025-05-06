package com.postgresql.studybuddy.security;
import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    public static final Dotenv dotenv = Dotenv.load(); // loads .env from root
}
