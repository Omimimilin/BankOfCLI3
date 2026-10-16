package com.revature.team2.bank3.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.team2.bank3.domain.Transaction;
import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.InsufficientFundsException;
import com.revature.team2.bank3.repository.TransactionRepository;

@ExtendWith(MockitoExtension.class) // JUnit 5 hook: lets Mockito create @Mock objects before each test
class TransactionServiceTest {

    @Mock
    TransactionRepository transactionRepo; // fake repo: every method does nothing/returns null
    @Mock
    UserService userService; // fake UserService: no DB involved

    @InjectMocks
    TransactionService service; // the REAL class under test; Mockito passes the mocks into its constructor

    @Test // marks a method JUnit should run
    void withdrawMoreThanBalanceThrowsAndChangesNothing() {
        User user = new User(1, "alice", "Alice", "1234", new BigDecimal("50")); // arrange:
        when(userService.getAccount(1)).thenReturn(user); // stub: "when asked for
        System.out.print(user.getBalance());
        assertThrows(InsufficientFundsException.class, // act + assert: the lambda
                () -> service.withdraw(1, new BigDecimal("75")));

        assertEquals(new BigDecimal("50"), user.getBalance()); // balance untouched
        verify(transactionRepo, never()).save(any(Transaction.class)); // nothing was
    }
}
