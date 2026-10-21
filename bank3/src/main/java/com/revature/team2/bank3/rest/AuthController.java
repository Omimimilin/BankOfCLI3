package com.revature.team2.bank3.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;
import com.revature.team2.bank3.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Authentication", description = "Endpoints for user registration and login")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Register a new user", description = "Registers a new user with the provided username, password, and name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Username already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<ResponseContract<RegisterResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        return this.authService.register(dto);
    }

    @Operation(summary = "Login", description = "Logs in a user with the provided username and password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User logged in successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<ResponseContract<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        return this.authService.login(dto);
    }
}
