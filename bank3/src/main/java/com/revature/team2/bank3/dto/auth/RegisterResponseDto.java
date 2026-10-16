package com.revature.team2.bank3.dto.auth;

public record RegisterResponseDto (
     Integer accountId,
     String username,
     String name
) {}