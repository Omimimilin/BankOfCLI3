package com.revature.team2.bank3.dto.auth;

public record LoginResponseDto (
    Long accountId,
    String username,
    String accessToken
) {}