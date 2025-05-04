package com.postgresql.studybuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@SpringBootApplication
public class StudybuddyApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudybuddyApplication.class, args);
	}

}
