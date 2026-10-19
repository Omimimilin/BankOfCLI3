package com.revature.team2.bank3.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.team2.bank3.domain.Transaction;
import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.InsufficientFundsException;
import com.revature.team2.bank3.exceptions.InvalidAmountException;
import com.revature.team2.bank3.exceptions.SelfTransferNotAllowedException;
import com.revature.team2.bank3.repository.TransactionRepository;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepo;
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    public TransactionService(TransactionRepository transactionRepo, UserService userService) {
        this.transactionRepo = transactionRepo;
        this.userService = userService;
    }

    @Transactional
    public void deposit(String username, BigDecimal amount) {
        User user = userService.getUserByUsername(username);
        increaseBalance(user, amount);
        Transaction tx = new Transaction(
                amount,
                "deposit",
                Instant.now(),
                user,
                null);
        transactionRepo.save(tx);
        log.info("Deposit transaction saved for {}", username);
    }

    private void increaseBalance(User user, BigDecimal amount) {
        // Verify Amount is not null
        if (amount == null) {
            throw new InvalidAmountException("Deposit amount must not be null");
            // Verify amount is not less than 0
        } else if (amount.signum() <= 0) {
            throw new InvalidAmountException("Deposit amount must be positive");
        }
        user.setBalance(user.getBalance().add(amount));
        log.info("Balance increased for user ID: {}. New balance: {}", user.getId(), user.getBalance());
    }

    @Transactional
    public void withdraw(String username, BigDecimal amount) {

        User user = userService.getUserByUsername(username);
        decreaseBalance(user, amount);
        Transaction tx = new Transaction(
                amount,
                "withdraw",
                Instant.now(),
                user,
                null);
        transactionRepo.save(tx);
        log.info("Withdraw transaction saved for {}", username);
    }

    private void decreaseBalance(User user, BigDecimal amount) {
        // Verify Amount is not null
        if (amount == null) {
            throw new InvalidAmountException("Withdraw amount must not be null");
        } // Verify amount is not less than 0
        else if (amount.signum() <= 0) {
            throw new InvalidAmountException("Withdraw amount must be positive");
            // Verify amount will not lead to overdrafting
        } else if (user.getBalance().subtract(amount).compareTo(BigDecimal.ZERO) < 0) {
            throw new InsufficientFundsException("Current Amount will lead to Overdrafting");
        }
        user.setBalance(user.getBalance().subtract(amount));
        log.info("Balance decreased for user ID: {}. New balance: {}", user.getId(), user.getBalance());
    }

    @Transactional
    public void transfer(String fromUsername, String toUsername, BigDecimal amount) {
        if (fromUsername == toUsername) {
            throw new SelfTransferNotAllowedException("Transferring to the same account is an invalid operation");
        }
        User fromUser = userService.getUserByUsername(fromUsername);
        User toUser = userService.getUserByUsername(toUsername);
        decreaseBalance(fromUser, amount);
        increaseBalance(toUser, amount);
        Transaction fromTX = new Transaction(
                amount,
                "transfer_out",
                Instant.now(),
                fromUser,
                toUser);
        Transaction toTX = new Transaction(
                amount,
                "transfer_in",
                Instant.now(),
                toUser,
                fromUser);

        transactionRepo.save(fromTX);
        transactionRepo.save(toTX);
        log.info("Transfer transaction saved from {} to {}", fromUsername, toUsername);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getHistory(String username) {
        User user = userService.getUserByUsername(username);
        List<Transaction> history = transactionRepo.findBySourceAccount_IdOrDestinationAccount_Id(user.getId(), null,
                Sort.by("timestamp"));
        return history;
    }

}
