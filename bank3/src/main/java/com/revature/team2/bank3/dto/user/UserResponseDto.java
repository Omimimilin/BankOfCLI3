package com.revature.team2.bank3.dto.user;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response DTO for user information")
public record UserResponseDto(
        @Schema(description = "The ID of the user's account") Integer accountId,
        @Schema(description = "The username of the user") String username,
        @Schema(description = "The name of the user") String name,
        @Schema(description = "The balance of the user's account") BigDecimal balance) {
}
