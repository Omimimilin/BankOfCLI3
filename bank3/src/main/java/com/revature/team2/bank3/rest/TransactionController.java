package com.revature.team2.bank3.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.domain.Transaction;
import com.revature.team2.bank3.dto.transaction.TransactionResponseDto;
import com.revature.team2.bank3.service.TransactionService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/transactions")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    // Add Transaction Service Here
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // records for transactions
    public record TransactionRequest(
            @NotBlank String username,
            @NotNull @DecimalMin("0.01") BigDecimal amount) {
    }

    public record TransferRequest(
            @NotBlank String username,
            @NotBlank String destinationUsername,
            @NotNull @DecimalMin("0.01") BigDecimal amount) {
    }

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponseDto> deposit(@Valid @RequestBody TransactionRequest req) {
        return created(transactionService.deposit(req.username(), req.amount()));
    }

    // Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponseDto> withdraw(@Valid @RequestBody TransactionRequest req) {
        return created(transactionService.withdraw(req.username(), req.amount()));
    }

    // Transfer
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponseDto> transfer(@Valid @RequestBody TransferRequest req) {
        return created(transactionService.transfer(req.username(), req.destinationUsername(), req.amount()));
    }

    private ResponseEntity<TransactionResponseDto> created(Transaction saved) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(TransactionResponseDto.from(saved));
    }

    @GetMapping
    public List<TransactionResponseDto> getTransactions(@RequestParam String username) {
        return transactionService.getHistory(username).stream()
                .map(TransactionResponseDto::from)
                .toList();
    }
}
