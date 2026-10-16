// package com.revature.team2.bank3.security;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import java.util.List;

// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// @Configuration
// public class SecurityConfig {

// @Bean
// public BCryptPasswordEncoder passwordEncoder() {
//     return new BCryptPasswordEncoder();
// }

// @Bean
// public DaoAuthenticationProvider authenticationProvider(
//     CustomUserDetailManager userDetailsManager,
//     BCryptPasswordEncoder passwordEncoder
// ) {
//     DaoAuthenticationProvider auth = 
//         new DaoAuthenticationProvider(userDetailsManager);

//     auth.setPasswordEncoder(passwordEncoder);
//     return auth;
// }

// @Bean
// public CorsConfigurationSource corsConfigurationSource() {
//     CorsConfiguration config = new CorsConfiguration();
//     config.setAllowedOrigins(List.of(
//         "http://localhost:4200",
//         "http://localhost:3000"));
//     config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//     config.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN",
//         "Authorization"));
//     config.setAllowCredentials(true);

//     UrlBasedCorsConfigurationSource source = new
//     UrlBasedCorsConfigurationSource();
//     source.registerCorsConfiguration("/**", config);
//     return source;
// }

// // @Bean
// // public SecurityFilterAutoConfiguration filterChain(
// //     HttpSecurity http,
// //     @Value("${app.security.csrf-cookie.same-site}") String csrfCookiesSameSite)
// //     throws Exception {

// // }

// }
