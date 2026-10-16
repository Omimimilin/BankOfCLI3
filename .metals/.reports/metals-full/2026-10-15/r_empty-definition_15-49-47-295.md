error id: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java:ResponseEntity/created#
file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
empty definition using pc, found symbol in pc: ResponseEntity/created#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 2637
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
    public Transaction transfer(String userId, BigDecimal amount, int transferId) {
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

    // FIXME: Deposit
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@AuthenticationPrincipal String userId, @Valid @RequestBody BigDecimal amount) {
        Transaction saved = transactionService.deposit(userId, amount);
    }

    // FIXME: Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@AuthenticationPrincipal String userId, @Valid @RequestBodyBigDecimal amount) {
        transactionService.withdraw(userId, amount);
    }

    // FIXME: Transfer
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@AuthenticationPrincipal String userId, @Valid @RequestBody BigDecimal amount, @RequestParam int id) {
        transactionService.transfer(userId, amount, id);
    }

    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable int id) {
        return new Transaction();
    }

    @GetMapping
    public List<Transaction> getTransactions() {
        return List.of();
    }

    // FIXME: create transaction
    // @PostMapping
    // public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        return ResponseEntity
                .cre@@ated(
                            ServletUriComponentsBuilder
                                    .fromCurrentRequest()
                                    .path("/{id}")
                                    .buildAndExpand(transaction.getId())
                                    .toUri())
                .body(transaction);
    // }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: ResponseEntity/created#