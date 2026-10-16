package com.revature.team2.bank3.rest;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.revature.team2.bank3.domain.Transaction;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


// FIXME: mocked class for now!
@Service
class TransactionService {
    public Transaction deposit(String username, BigDecimal amount) {
        return new Transaction();
    }
    public Transaction withdraw(String username, BigDecimal amount) {
        return new Transaction();
    }
    public Transaction transfer(String username, String destinationUsername, BigDecimal amount) {
        return new Transaction();
    }
    public List<Transaction> getHistory(String username) {
        return new ArrayList<Transaction>();
    }
}

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    // Add Transaction Service Here
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // records for transactions
    public record TransactionRequest(
        @NotBlank String username,
        @NotNull @DecimalMin("0.01") BigDecimal amount) {}

    public record TransferRequest(
            @NotBlank String username,
            @NotBlank String destinationUsername,
            @NotNull @DecimalMin("0.01") BigDecimal amount) {}

    // Deposit
    @PostMapping("/deposit")
    // FIXME: replace userId with @AuthenticationPrincipal later! 
    public ResponseEntity<Transaction> deposit(@Valid @RequestBody TransactionRequest req) {
        return created(transactionService.deposit(req.username(), req.amount()));
    }

    // Withdraw
    // FIXME: replace userId with @AuthenticationPrincipal later!
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@Valid @RequestBody TransactionRequest req) {
        return created(transactionService.withdraw(req.username(), req.amount()));
    }

    // Transfer
    // FIXME: replace userId with @AuthenticationPrincipal later!
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@Valid @RequestBody TransferRequest req) {
        return created(transactionService.transfer(req.username(), req.destinationUsername(), req.amount()));
    }

    private ResponseEntity<Transaction> created(Transaction saved) {
        return ResponseEntity
                .created(ServletUriComponentsBuilder
                        .fromCurrentContextPath() // does not use fromCurrentRequest so we don't get /api/transactions/deposit/5
                        .path("/api/transactions/{id}")
                        .buildAndExpand(saved.getId())
                        .toUri())
                .body(saved);
    }

    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable int id) {
        return new Transaction();
    }

    @GetMapping
    // FIXME: replace userId with @AuthenticationPrincipal later!
    // FIXME: TransactionResponse shd replace Transaction, according to the draw.io file!!
    public List<Transaction> getTransactions(@RequestParam String username) {
        return transactionService.getHistory(username);
    }
}
