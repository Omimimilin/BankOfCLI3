package com.revature.team2.bank3.dto.user;

import java.math.BigDecimal;

public record UserResponseDto(
    Long accountId,
    String username,
    String name,
    BigDecimal balance
) {}
