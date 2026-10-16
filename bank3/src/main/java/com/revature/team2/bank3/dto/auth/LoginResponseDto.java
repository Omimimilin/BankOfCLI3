package com.revature.team2.bank3.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema (description = "Response DTO for user login")
public record LoginResponseDto (
    @Schema (description = "The ID of the logged-in user's account") Integer accountId,
    @Schema (description = "The username of the logged-in user") String username,
    @Schema (description = "The access token for the logged-in user") String accessToken
) {}