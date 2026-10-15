package com.revature.team2.bank3.service; // same package as the service, so the test can see package-private members

import static org.junit.jupiter.api.Assertions.assertEquals; // assertion: expected value vs actual value
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal; // exact decimal type used for money
import java.sql.Date; // the Date type User.createdAt uses
import java.util.List; // getHistory returns a List

import org.junit.jupiter.api.Test; // marks a method as a test case
import org.springframework.beans.factory.annotation.Autowired; // ask Spring to inject a real bean
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest; // Boot 4 location of @DataJpaTest
import org.springframework.context.annotation.Import; // register extra beans in the test context

import com.revature.team2.bank3.domain.Transaction; // history entity
import com.revature.team2.bank3.domain.User; // account entity
import com.revature.team2.bank3.exceptions.InvalidAmountException;
import com.revature.team2.bank3.exceptions.SelfTransferNotAllowedException;
import com.revature.team2.bank3.persistence.UserRepository; // real repo, used to set up and read back data

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
        User saved = userRepo.saveAndFlush(new User("alice", new BigDecimal("50.00"), new Date(0)));

        // ACT: call the real service, which loads the user, changes balance, saves a
        // Transaction
        service.deposit(saved.getId(), new BigDecimal("25.00"));

        // ASSERT 1: reload the user from the DB; compareTo == 0 ignores scale (75.0 vs
        // 75.00)
        assertEquals(0, new BigDecimal("75.00").compareTo(userRepo.findById(saved.getId()).orElseThrow().getBalance()));
        // ASSERT 2: run the real history query (findByUserOrderByCreatedAtDesc)
        List<Transaction> history = service.getHistory(saved.getId());
        assertEquals(1, history.size()); // exactly one history row was written
        assertEquals("DEPOSIT", history.get(0).getType()); // and it is labelled DEPOSIT
    }

    @Test
    void depositNegativeAmountAndHistoryEmpty() {
        User saved = userRepo.saveAndFlush(new User("alice", new BigDecimal("50.00"), new Date(0)));
        assertThrows(InvalidAmountException.class, () -> {
            service.deposit(saved.getId(), new BigDecimal("-100"));
        });
        List<Transaction> history = service.getHistory(saved.getId());
        assertEquals(0, history.size());
    }

    @Test
    void withdrawNegativeAmountAndHistoryEmpty() {
        User saved = userRepo.saveAndFlush(new User("alice", new BigDecimal("50.00"), new Date(0)));
        assertThrows(InvalidAmountException.class, () -> {
            service.withdraw(saved.getId(), new BigDecimal("-100"));
        });
        List<Transaction> history = service.getHistory(saved.getId());
        assertEquals(0, history.size());
    }

    @Test
    void transferToSameAccount() {
        User saved = userRepo.saveAndFlush(new User("alice", new BigDecimal("50.00"), new Date(0)));
        assertThrows(SelfTransferNotAllowedException.class, () -> {
            service.transfer(saved.getId(), saved.getId(), new BigDecimal("-100"));
        });
        List<Transaction> history = service.getHistory(saved.getId());
        assertEquals(0, history.size());
    }

    @Test
    void transferSuccesfullyandHistorySaved() {
        User saved1 = userRepo.saveAndFlush(new User("alice", new BigDecimal("50.00"), new Date(0)));
        User saved2 = userRepo.saveAndFlush(new User("pedro", new BigDecimal("100.00"), new Date(0)));
        // mock transaction
        service.transfer(saved1.getId(), saved2.getId(), new BigDecimal("20"));
        assertEquals(0,
                new BigDecimal("30.00").compareTo(userRepo.findById(saved1.getId()).orElseThrow().getBalance()));
        assertEquals(0,
                new BigDecimal("120.00").compareTo(userRepo.findById(saved2.getId()).orElseThrow().getBalance()));

        List<Transaction> history1 = service.getHistory(saved1.getId());
        for (Transaction tx : history1) {
            System.out.println(tx);
        }
        assertEquals(1, history1.size());
        List<Transaction> history2 = service.getHistory(saved2.getId());
        for (Transaction tx : history2) {
            System.out.println(tx);
        }
        assertEquals(1, history2.size());
    }
}
