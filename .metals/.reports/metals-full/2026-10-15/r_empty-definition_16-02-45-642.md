error id: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java:_empty_/RequestBody#
file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
empty definition using pc, found symbol in pc: _empty_/RequestBody#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 2371
uri: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
text:
```scala
package com.revature.team2.bank3.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.revature.team2.bank3.domain.Transaction;

import jakarta.validation.Valid;


// FIXME: mocked class for now!
@Service
class TransactionService {
    public Transaction deposit(String userId, BigDecimal amount) {
        return new Transaction();
    }
    public Transaction withdraw(String userId, BigDecimal amount) {
        return new Transaction();
    }
    public Transaction transfer(String userId, int transferId, BigDecimal amount) {
        return new Transaction();
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

    // Deposit
    @PostMapping("/deposit")
    // FIXME: replace userId with @AuthenticationPrincipal later!
    public ResponseEntity<Transaction> deposit(@RequestParam String userId, @Valid @RequestBody BigDecimal amount) {
        Transaction saved = transactionService.deposit(userId, amount);

        return ResponseEntity
        .created(ServletUriComponentsBuilder
                    .fromCurrentContextPath() // won't use fromCurrentRequest bc /api/transactions/deposit/5 is wrong
                    .path("/api/transactions/{id}")
                    .buildAndExpand(saved.getId())
                    .toUri())
        .body(saved);
    }

    // Withdraw
    // FIXME: replace userId with @AuthenticationPrincipal later!
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestParam String userId, @Valid @RequestBo@@dy BigDecimal amount) {
        Transaction saved = transactionService.withdraw(userId, amount);

        return ResponseEntity
        .created(ServletUriComponentsBuilder
                    .fromCurrentContextPath() // won't use fromCurrentRequest bc /api/transactions/deposit/5 is wrong
                    .path("/api/transactions/{id}")
                    .buildAndExpand(saved.getId())
                    .toUri())
        .body(saved);
    }

    // Transfer
    // FIXME: replace userId with @AuthenticationPrincipal later!
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestParam String userId, @RequestParam int id, @Valid @RequestBody BigDecimal amount) {
        Transaction saved = transactionService.transfer(userId, id, amount);

        return ResponseEntity
        .created(ServletUriComponentsBuilder
                    .fromCurrentContextPath() // won't use fromCurrentRequest bc /api/transactions/deposit/5 is wrong
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
    public List<Transaction> getTransactions() {
        return List.of();
    }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: _empty_/RequestBody#