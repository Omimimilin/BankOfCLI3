error id: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java:_empty_/userId#
file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
empty definition using pc, found symbol in pc: _empty_/userId#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 2073
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
    public Transaction transfer(String userId, String transferId, BigDecimal amount) {
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
    // // FIXME: accept both as a json 
    public ResponseEntity<Transaction> deposit(@RequestParam String username, @RequestParam BigDecimal amount) {
        return created(transactionService.deposit(username, amount));
    }

    // Withdraw
    // FIXME: replace userId with @AuthenticationPrincipal later!
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestParam String username, @RequestParam BigDecimal amount) {
        return created(transactionService.withdraw(us@@ername, amount));
    }

    // Transfer
    // FIXME: replace userId with @AuthenticationPrincipal later!
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestParam String username, @RequestParam String transferUsername, @RequestParam BigDecimal amount) {
        return created(transactionService.transfer(userId, transferId, amount));
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
    public List<Transaction> getTransactions() {
        return List.of();
    }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: _empty_/userId#