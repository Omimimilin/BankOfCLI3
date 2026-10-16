package com.revature.team2.bank3.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;
import com.revature.team2.bank3.rest.ResponseContract;
import com.revature.team2.bank3.security.JwtUtil;

import jakarta.transaction.Transactional;

@Service
public class AuthService {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthService(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public ResponseEntity<ResponseContract<RegisterResponseDto>> register(RegisterRequestDto dto) {
        // TODO: Register user (check for duplicate usernames too)

        User potentialUser = userService.getUserByUsername(dto.username());

        RegisterResponseDto responseDto = new RegisterResponseDto(null, dto.username(), dto.name());
        return ResponseContract.success(HttpStatus.CREATED, responseDto);
    }

    public ResponseEntity<ResponseContract<LoginResponseDto>> login(LoginRequestDto dto) {
        try {
            // TODO: Check if credentials are valid

            var responseDto = new LoginResponseDto(
                    null,
                    null,
                    jwtUtil.generateToken("USERNAME HERE"));
            return ResponseContract.success(HttpStatus.CREATED, responseDto);
        } catch (Exception e) {
            return ResponseContract.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

    }
}
