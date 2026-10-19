package com.revature.team2.bank3.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;
import com.revature.team2.bank3.exceptions.UserNotFoundException;
import com.revature.team2.bank3.rest.ResponseContract;
import com.revature.team2.bank3.security.JwtUtil;
import com.revature.team2.bank3.security.SecurityConfig;

import jakarta.transaction.Transactional;

@Service
public class AuthService {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final SecurityConfig securityConfig;

    public AuthService(UserService userService, JwtUtil jwtUtil, SecurityConfig securityConfig) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.securityConfig = securityConfig;
    }

    @Transactional
    public ResponseEntity<ResponseContract<RegisterResponseDto>> register(RegisterRequestDto requestDto) {
        if (this.userService.existsByUsername(requestDto.username())) {
            return ResponseContract.error(HttpStatus.CONFLICT,
                    String.format("Username `%s` already exists.", requestDto.username()));
        }
        User user = this.userService.createUser(
                requestDto.username(),
                requestDto.name(),
                securityConfig.passwordEncoder()
                    .encode(requestDto.plainTextPin()));
        var responseDto = new RegisterResponseDto(
                user.getId(),
                user.getUsername(),
                user.getName());
        return ResponseContract.success(HttpStatus.CREATED, responseDto);
    }

    public ResponseEntity<ResponseContract<LoginResponseDto>> login(LoginRequestDto requestDto) {
        try {
            User user = this.userService.getUserByUsername(requestDto.username());

            if (securityConfig.passwordEncoder().matches(
                 requestDto.plainTextPin(),
                 user.getPin())) {
                String jwt = jwtUtil.generateToken(user);
                LoginResponseDto responseDto = new LoginResponseDto(
                        user.getId(),
                        user.getUsername(),
                        jwt);
                return ResponseContract.success(HttpStatus.CREATED, responseDto);
            } else {
                return ResponseContract.error(HttpStatus.UNAUTHORIZED, "Invalid credentials. Please try again.");
            }
        } catch (UserNotFoundException e) {
            return ResponseContract.error(HttpStatus.UNAUTHORIZED, "Invalid credentials. Please try again.");
        }

    }
}
