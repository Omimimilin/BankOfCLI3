package com.revature.team2.bank3.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.dto.auth.LoginRequestDto;
import com.revature.team2.bank3.dto.auth.LoginResponseDto;
import com.revature.team2.bank3.dto.auth.RegisterRequestDto;
import com.revature.team2.bank3.dto.auth.RegisterResponseDto;
import com.revature.team2.bank3.security.JwtUtil;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication", description = "Endpoints for user registration and login")
@RestController
@CrossOrigin(origins = "*") // TODO: setup CORS correctly
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "Register a new user", description = "Registers a new user with the provided username, password, and name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(implementation = ResponseContract.class))),
            @ApiResponse(responseCode = "409", description = "Username already exists", content = @Content(schema = @Schema(implementation = ResponseContract.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<ResponseContract<RegisterResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        // TODO: Register user (check for duplicate usernames too)

        RegisterResponseDto responseDto = new RegisterResponseDto(null, dto.username(), dto.name());
        return ResponseContract.success(HttpStatus.CREATED, responseDto);
    }

    @Operation(summary = "Login", description = "Logs in a user with the provided username and password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User logged in successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<ResponseContract<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
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
