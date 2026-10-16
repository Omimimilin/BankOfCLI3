// package com.revature.team2.bank3.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import java.util.List;

// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// @Configuration
// public class SecurityConfig {

// @Bean
// public BCryptPasswordEncoder passwordEncoder() {
// return new BCryptPasswordEncoder();
// }

// @Bean
// public CorsConfigurationSource corsConfigurationSource() {
// CorsConfiguration config = new CorsConfiguration();
// config.setAllowedOrigins(List.of(
// "http://localhost:4200",
// "http://localhost:3000"));
// config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
// config.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN",
// "Authorization"));
// config.setAllowCredentials(true);

// UrlBasedCorsConfigurationSource source = new
// UrlBasedCorsConfigurationSource();
// source.registerCorsConfiguration("/**", config);
// return source;
// }
// }
