error id: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java:_empty_/Transaction#
file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
empty definition using pc, found symbol in pc: _empty_/Transaction#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 991
uri: file://<WORKSPACE>/bank3/src/main/java/com/revature/team2/bank3/rest/TransactionController.java
text:
```scala
package com.revature.team2.bank3.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.revature.team2.bank3.domain.Transaction;

import jakarta.validation.Valid;

// class TransactionWriteDto {
// }

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    // Add Transaction Service Here

    // FIXME: Deposit

    // FIXME: Withdraw

    // FIXME: Transfer

    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable int id) {
        return new Transac@@tion();
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

empty definition using pc, found symbol in pc: _empty_/Transaction#