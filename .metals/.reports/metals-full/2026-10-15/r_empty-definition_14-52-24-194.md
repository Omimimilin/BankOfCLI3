error id: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java:local7
file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
empty definition using pc, found symbol in pc: 
found definition using semanticdb; symbol local7
empty definition using fallback
non-local guesses:

offset: 1706
uri: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
text:
```scala
package com.revature.team2.bank3.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
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
class TransactionService {
    public void doDeposit(BigDecimal amount) {
    }
    public void doWithdraw(BigDecimal amount) {
    }
    public void doTransfer(BigDecimal amount, int id) {
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
    public void doDeposit(@RequestParam BigDecimal amount) {
        transactionService.doDeposit(amount);
    }

    // FIXME: Withdraw
    @PostMapping("/withdraw")
    public void doWithdraw(@RequestParam BigDecimal amount) {
        transactionService.doDeposit(amount);
    }

    // FIXME: Transfer
    @PostMapping("/transfer")
    public void doTransfer(BigDecimal@@ amount, int id) {
        transactionService.doDeposit(amount);
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

empty definition using pc, found symbol in pc: 