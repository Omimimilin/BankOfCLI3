package com.revature.team2.bank3.dto.auth;

public record LoginResponseDto (
    Integer accountId,
    String username,
    String accessToken
) {}