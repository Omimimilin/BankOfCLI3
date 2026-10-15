package com.revature.team2.bank3.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.sql.Date;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.team2.bank3.domain.Transaction;
import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.InsufficientFundsException;
import com.revature.team2.bank3.persistence.TransactionRepository;

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
        User user = new User("alice", new BigDecimal("50"), new Date(0)); // arrange: real object with 50
        when(userService.getAccount(1L)).thenReturn(user); // stub: "when asked for user 1, return alice"
        System.out.print(user.getBalance());
        assertThrows(InsufficientFundsException.class, // act + assert: the lambda must throw this type
                () -> service.withdraw(1L, new BigDecimal("75")));

        assertEquals(new BigDecimal("50"), user.getBalance()); // balance untouched
        verify(transactionRepo, never()).save(any(Transaction.class)); // nothing was logged
    }
}
