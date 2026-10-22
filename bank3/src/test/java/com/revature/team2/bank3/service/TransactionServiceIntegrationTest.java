package com.revature.team2.bank3.service; // same package as the service, so the test can see package-private members

import static org.junit.jupiter.api.Assertions.assertEquals; // assertion: expected value vs actual value
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.revature.team2.bank3.domain.Transaction; // history entity
import com.revature.team2.bank3.domain.User; // account entity
import com.revature.team2.bank3.exceptions.InsufficientFundsException;
import com.revature.team2.bank3.exceptions.InvalidAmountException;
import com.revature.team2.bank3.exceptions.SelfTransferNotAllowedException;
import com.revature.team2.bank3.exceptions.UserNotFoundException;
import com.revature.team2.bank3.repository.UserRepository;

@DataJpaTest // boots only JPA: entities, repositories, in-memory H2; rolls back after each
             // test
@Import({ TransactionService.class, UserService.class }) // @DataJpaTest skips @Service beans, so add ours manually
class TransactionServiceIntegrationTest {

    @Autowired // real TransactionService, built by Spring with the real repos (no mocks)
    TransactionService service;
    @Autowired // real UserRepository talking to H2
    UserRepository userRepo;

    @Test // JUnit runs this method
    void depositUpdatesBalanceAndWritesHistory() {
        // ARRANGE: insert a user with 50.00 and flush so it is really in the DB
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));

        // ACT: call the real service, which loads the user, changes balance, saves a
        // Transaction
        service.deposit(saved.getUsername(), new BigDecimal("25.00"), null);

        // ASSERT 1: reload the user from the DB; compareTo == 0 ignores scale (75.0
        // 75.00)
        assertEquals(0,
                new BigDecimal("75.00")
                        .compareTo(userRepo.findByUsername(saved.getUsername()).orElseThrow().getBalance()));
        // ASSERT 2: run the real history query (findByUserOrderByCreatedAtDesc)
        List<Transaction> history = service.getHistory(saved.getUsername());
        assertEquals(1, history.size()); // exactly one history row was written
        assertEquals("deposit", history.get(0).getTransferType()); // and it is labelled
    }

    @Test
    void depositNegativeAmountAndHistoryEmpty() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        assertThrows(InvalidAmountException.class, () -> {
            service.deposit(saved.getUsername(), new BigDecimal("-100"), null);
        });
        List<Transaction> history = service.getHistory(saved.getUsername());
        assertEquals(0, history.size());
    }

    @Test
    void withdrawNegativeAmountAndHistoryEmpty() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        assertThrows(InvalidAmountException.class, () -> {
            service.withdraw(saved.getUsername(), new BigDecimal("-100"), null);
        });
        List<Transaction> history = service.getHistory(saved.getUsername());
        assertEquals(0, history.size());
    }

    @Test
    void transferToSameAccount() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        assertThrows(SelfTransferNotAllowedException.class, () -> {
            service.transfer(saved.getUsername(), saved.getUsername(), new BigDecimal("100"), null);
        });
        List<Transaction> history = service.getHistory(saved.getUsername());
        assertEquals(0, history.size());
    }

    @Test
    void transferSuccesfullyandHistorySaved() {
        User saved1 = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        User saved2 = userRepo.saveAndFlush(new User("pedro", "Pedro", "1234", new BigDecimal("100.00")));
        // mock transaction
        service.transfer(saved1.getUsername(), saved2.getUsername(), new BigDecimal("20"), null);
        assertEquals(0,
                new BigDecimal("30.00")
                        .compareTo(userRepo.findByUsername(saved1.getUsername()).orElseThrow().getBalance()));
        assertEquals(0,
                new BigDecimal("120.00")
                        .compareTo(userRepo.findByUsername(saved2.getUsername()).orElseThrow().getBalance()));

        System.out.print("\n\n\n\n");
        List<Transaction> history1 = service.getHistory(saved1.getUsername());
        for (Transaction tx : history1) {
            System.out.println(tx);
        }
        assertEquals(1, history1.size());
        List<Transaction> history2 = service.getHistory(saved2.getUsername());
        for (Transaction tx : history2) {
            System.out.println(tx);
        }
        System.out.print("\n\n\n\n");
        assertEquals(1, history2.size());
    }

    private void assertBalance(String expected, String username) {
        assertEquals(0,
                new BigDecimal(expected).compareTo(userRepo.findByUsername(username).orElseThrow().getBalance()));
    }

    @Test
    void threeDepositsSumCorrectlyAndWriteThreeHistoryRows() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        service.deposit(saved.getUsername(), new BigDecimal("10.00"), null);
        service.deposit(saved.getUsername(), new BigDecimal("20.50"), null);
        service.deposit(saved.getUsername(), new BigDecimal("0.25"), null);

        assertBalance("80.75", saved.getUsername());
        assertEquals(3, service.getHistory(saved.getUsername()).size());
    }

    @Test
    void bigDepositThenThreeWithdrawalsLeavesCorrectBalance() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("0.00")));
        service.deposit(saved.getUsername(), new BigDecimal("1000.00"), null);
        service.withdraw(saved.getUsername(), new BigDecimal("100.00"), null);
        service.withdraw(saved.getUsername(), new BigDecimal("250.50"), null);
        service.withdraw(saved.getUsername(), new BigDecimal("49.50"), null);

        assertBalance("600.00", saved.getUsername());
        assertEquals(4, service.getHistory(saved.getUsername()).size()); // 1 deposit + 3 withdrawals
    }

    @Test
    void withdrawMoreThanBalanceThrowsAndChangesNothing() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        assertThrows(InsufficientFundsException.class,
                () -> service.withdraw(saved.getUsername(), new BigDecimal("75.00"), null));

        assertBalance("50.00", saved.getUsername());
        assertEquals(0, service.getHistory(saved.getUsername()).size());
    }

    @Test
    void withdrawExactBalanceLeavesZero() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        service.withdraw(saved.getUsername(), new BigDecimal("50.00"), null);

        assertBalance("0.00", saved.getUsername());
    }

    @Test
    void transferToNonExistentAccountThrowsAndChangesNothing() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        assertThrows(UserNotFoundException.class,
                () -> service.transfer(saved.getUsername(), "99999", new BigDecimal("20.00"), null));

        assertBalance("50.00", saved.getUsername());
        assertEquals(0, service.getHistory(saved.getUsername()).size());
    }

    @Test
    void transferMoreThanBalanceThrowsAndChangesNothing() {
        User alice = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        User pedro = userRepo.saveAndFlush(new User("pedro", "Pedro", "1234", new BigDecimal("100.00")));
        assertThrows(InsufficientFundsException.class,
                () -> service.transfer(alice.getUsername(), pedro.getUsername(), new BigDecimal("75.00"), null));

        assertBalance("50.00", alice.getUsername());
        assertBalance("100.00", pedro.getUsername());
    }

    @Test
    void depositStoresNoteInHistory() {
        User saved = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        service.deposit(saved.getUsername(), new BigDecimal("10.00"), "Groceries");

        assertEquals("Groceries", service.getHistory(saved.getUsername()).get(0).getDescription());
    }

    @Test
    void transferStoresNoteOnSenderRow() {
        User alice = userRepo.saveAndFlush(new User("alice", "Alice", "1234", new BigDecimal("50.00")));
        User pedro = userRepo.saveAndFlush(new User("pedro", "Pedro", "1234", new BigDecimal("100.00")));
        service.transfer(alice.getUsername(), pedro.getUsername(), new BigDecimal("20.00"), "Rent expenses");

        assertEquals("Rent expenses", service.getHistory(alice.getUsername()).get(0).getDescription());
    }
}
