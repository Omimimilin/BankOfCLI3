package com.revature.team2.bank3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SpringBootApplication
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", scheme = "bearer", description = "Enter your JWT token to access secured endpoints")
public class Main {
	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
}
