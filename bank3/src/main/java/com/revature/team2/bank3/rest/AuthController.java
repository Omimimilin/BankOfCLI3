package com.revature.team2.bank3.rest;

import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        // TODO: Register user (check for duplicate usernames too)

        RegisterResponseDto responseDto = new RegisterResponseDto(null, dto.username(), dto.nickname());
        ApiResponse<RegisterResponseDto> res = ApiResponse.success(responseDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        // TODO: Perform authentication logic
        
        LoginResponseDto responseDto = new LoginResponseDto(null, dto.username(), "JWT");
        ApiResponse<LoginResponseDto> res = ApiResponse.success(responseDto);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
