package com.revature.team2.bank3.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
@Schema (description = "Request DTO for user registration")
public record RegisterRequestDto(
        @NotBlank @Schema (description = "The username of the user") String username,
        @NotBlank @Schema (description = "The name of the user") String name,
        @NotBlank @Schema (description = "The plain text PIN of the user") String plainTextPin) {
}