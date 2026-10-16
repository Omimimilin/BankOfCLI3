// package com.revature.team2.bank3.security;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.web.AuthenticationEntryPoint;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

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

// @Bean
// public SecurityFilterChain filterChain(
//     HttpSecurity http,
//     @Value("${app.security.csrf-cookie.same-site}") String csrfCookiesSameSite)
//     throws Exception {
//         http.authorizeHttpRequests(configurer -> configurer
//             .requestMatchers(
//                 "/api/auth/register",
//                 "/api/auth/login",
//                 "/swagger-ui/**",
//                 "/swagger-ui.html",
//                 "/v3/api-docs/**")
//                 .permitAll()
//                 .anyRequest().authenticated()
//         );
    
//     AuthenticationEntryPoint apiAuthenticationEntryPoint =
//         (request, response, exception) -> response.setStatus(401);
//     http.httpBasic(httpBasic -> httpBasic.authenticationEntryPoint(apiAuthenticationEntryPoint));
//     http.cors(Customizer.withDefaults());
//     http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));

//     return http.build();
// }

package com.revature.team2.bank3.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
