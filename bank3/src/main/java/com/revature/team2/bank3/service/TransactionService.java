package com.revature.team2.bank3.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.revature.team2.bank3.domain.Transaction;
import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.InsufficientFundsException;
import com.revature.team2.bank3.exceptions.InvalidAmountException;
import com.revature.team2.bank3.exceptions.SelfTransferNotAllowedException;
import com.revature.team2.bank3.persistence.TransactionRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepo;
    private final UserService userService;

    public TransactionService(TransactionRepository transactionRepo, UserService userService) {
        this.transactionRepo = transactionRepo;
        this.userService = userService;
    }

    @Transactional
    public void deposit(long id, BigDecimal amount) {
        User user = userService.getAccount(id);
        increaseBalance(user, amount);
        Transaction tx = new Transaction(
                user,
                "DEPOSIT",
                amount,
                "",
                LocalDate.now());
        transactionRepo.save(tx);
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
    }

    @Transactional
    public void withdraw(long id, BigDecimal amount) {

        User user = userService.getAccount(id);
        decreaseBalance(user, amount);
        Transaction tx = new Transaction(
                user,
                "WITHDRAW",
                amount.negate(),
                "",
                LocalDate.now());
        transactionRepo.save(tx);
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
    }

    @Transactional
    public void transfer(long fromId, long toId, BigDecimal amount) {
        if (fromId == toId) {
            throw new SelfTransferNotAllowedException("Transferring to the same account is an invalid operation");
        }
        User fromUser = userService.getAccount(fromId);
        User toUser = userService.getAccount(toId);
        decreaseBalance(fromUser, amount);
        increaseBalance(toUser, amount);
        Transaction fromTX = new Transaction(
                fromUser,
                "TRANSFER_OUT",
                amount.negate(),
                toUser.getUsername(),
                LocalDate.now());
        Transaction toTX = new Transaction(
                toUser,
                "TRANSFER_IN",
                amount,
                fromUser.getUsername(),
                LocalDate.now());
        transactionRepo.save(fromTX);
        transactionRepo.save(toTX);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getHistory(long id) {
        User user = userService.getAccount(id);
        List<Transaction> history = transactionRepo.findByUserOrderByCreatedAtDesc(user);
        return history;
    }

}
