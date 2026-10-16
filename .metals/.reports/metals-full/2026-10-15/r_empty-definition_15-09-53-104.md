error id: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java:java/lang/String#
file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
empty definition using pc, found symbol in pc: java/lang/String#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 936
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
    public void doDeposit(String userId, BigDecimal amount) {
    }
    public void doWithdraw(String userId, BigDecimal amount) {
    }
    public void doTransfer(@@String userId,BigDecimal amount, int id) {
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
    public void doDeposit(@AuthenticationPrincipal String userId, @Valid @RequestBody BigDecimal amount) {
        transactionService.doDeposit(amount);
    }

    // FIXME: Withdraw
    @PostMapping("/withdraw")
    public void doWithdraw(@AuthenticationPrincipal String userId, @Valid @RequestBodyBigDecimal amount) {
        transactionService.doWithdraw(amount);
    }

    // FIXME: Transfer
    @PostMapping("/transfer")
    public void doTransfer(@AuthenticationPrincipal String userId, @Valid @RequestBody BigDecimal amount, @RequestParam int id) {
        transactionService.doTransfer(amount, id);
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
    //     return ResponseEntity
    //             .created(
    //                         ServletUriComponentsBuilder
    //                                 .fromCurrentRequest()
    //                                 .path("/{id}")
    //                                 .buildAndExpand(transaction.getId())
    //                                 .toUri())
    //             .body(transaction);
    // }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: java/lang/String#