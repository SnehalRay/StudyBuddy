package com.postgresql.studybuddy;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@SpringBootApplication
public class StudybuddyApplication {


	public static void main(String[] args) {

		// Load .env before Spring context starts
		Dotenv dotenv = Dotenv.load();
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(StudybuddyApplication.class, args);
	}

}
