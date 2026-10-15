package com.revature.team2.bank3.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequestDto(
        @NotBlank String username,
        @NotBlank String name,
        @NotBlank String plainTextPin) {
}