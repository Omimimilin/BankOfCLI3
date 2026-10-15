package com.revature.team2.bank3.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<BankApiResponse<RegisterResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        // TODO: Register user (check for duplicate usernames too)

        RegisterResponseDto responseDto = new RegisterResponseDto(null, dto.username(), dto.name());
        return BankApiResponse.success(HttpStatus.CREATED, responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<BankApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        // TODO: Check if credentials are valid

        LoginResponseDto responseDto = new LoginResponseDto(null, dto.username(), null);
        return BankApiResponse.success(HttpStatus.CREATED, responseDto);
    }
}
