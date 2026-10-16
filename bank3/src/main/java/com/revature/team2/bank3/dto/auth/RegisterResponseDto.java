package com.revature.team2.bank3.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema (description = "Response DTO for user registration")
public record RegisterResponseDto (
    @Schema (description = "The ID of the registered user's account") Integer accountId,
    @Schema (description = "The username of the registered user") String username,
    @Schema (description = "The name of the registered user") String name
) {}