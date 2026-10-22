package com.revature.team2.bank3.dto.transaction;

import java.math.BigDecimal;
import java.time.Instant;

import com.revature.team2.bank3.domain.Transaction;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response DTO for transaction information")
public record TransactionResponseDto(
        @Schema(description = "The ID of the transaction") Integer id,
        @Schema(description = "The amount of the transaction") BigDecimal amount,
        @Schema(description = "The type of the transaction", example = "deposit") String transferType,
        @Schema(description = "The time the transaction occurred") Instant timestamp,
        @Schema(description = "The username of the source account") String sourceUsername,
        @Schema(description = "The username of the destination account, null for deposits and withdrawals") String destinationUsername,
        @Schema(description = "A description of the transaction being done") String description) {

    public static TransactionResponseDto from(Transaction tx) {
        return new TransactionResponseDto(
                tx.getId(),
                tx.getAmount(),
                tx.getTransferType(),
                tx.getTimestamp(),
                tx.getSourceAccount().getUsername(),
                tx.getDestinationAccount() == null ? null : tx.getDestinationAccount().getUsername(),
                tx.getDescription());
    }
}
