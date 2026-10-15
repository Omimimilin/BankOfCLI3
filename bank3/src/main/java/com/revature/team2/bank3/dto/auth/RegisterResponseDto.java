package com.revature.team2.bank3.dto.auth;

public record RegisterResponseDto (
     Long accountId,
     String username,
     String nickname
) {}