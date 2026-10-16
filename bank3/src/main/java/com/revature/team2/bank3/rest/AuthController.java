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

@RestController
@CrossOrigin(origins = "*") // TODO: setup CORS correctly
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseContract<RegisterResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        // TODO: Register user (check for duplicate usernames too)

        RegisterResponseDto responseDto = new RegisterResponseDto(null, dto.username(), dto.name());
        return ResponseContract.success(HttpStatus.CREATED, responseDto);
    }

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

    @PostMapping("/protected")
    public String hello() {
        return "Protected resource accessed successfully!";
    }
}
