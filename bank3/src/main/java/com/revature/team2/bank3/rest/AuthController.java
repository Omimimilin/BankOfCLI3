package com.revature.team2.bank3.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
@Tag (name = "Authentication", description = "Endpoints for user registration and login")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Operation (summary = "Register a new user", description = "Registers a new user with the provided username, password, and name.")
    @ApiResponses (value = {
        @ApiResponse (responseCode = "201", description = "User registered successfully"),
        @ApiResponse (responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(implementation = BankApiResponse.class))),
        @ApiResponse (responseCode = "409", description = "Username already exists", content = @Content(schema = @Schema(implementation = BankApiResponse.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<BankApiResponse<RegisterResponseDto>> register(@Valid @RequestBody @Parameter(description = "The request body containing user registration details") @RequestParam RegisterRequestDto dto) {
        // TODO: Register user (check for duplicate usernames too)

        RegisterResponseDto responseDto = new RegisterResponseDto(null, dto.username(), dto.name());
        return BankApiResponse.success(HttpStatus.CREATED, responseDto);
    }

    @Operation (summary = "Login", description = "Logs in a user with the provided username and password.")
    @ApiResponses (value = {
        @ApiResponse (responseCode = "200", description = "User logged in successfully"),
        @ApiResponse (responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<BankApiResponse<LoginResponseDto>> login(@Valid @RequestBody @Parameter(description = "The request body containing user login details") @RequestParam LoginRequestDto dto) {
        // TODO: Check if credentials are valid

        LoginResponseDto responseDto = new LoginResponseDto(null, dto.username(), null);
        return BankApiResponse.success(HttpStatus.CREATED, responseDto);
    }
}
