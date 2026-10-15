package com.revature.team2.bank3.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @NotBlank String username,
        @NotBlank String plainTextPin) {
}