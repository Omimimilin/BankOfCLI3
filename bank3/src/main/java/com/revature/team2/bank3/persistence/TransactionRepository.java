package com.revature.team2.bank3.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.team2.bank3.domain.Transaction;
import com.revature.team2.bank3.domain.User;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    public List<Transaction> findByUserOrderByCreatedAtDesc(User user);
}
