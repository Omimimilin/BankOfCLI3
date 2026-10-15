package com.revature.team2.bank3.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.revature.team2.bank3.domain.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    // returns all transactions (includes if they are on recieving end of a transfer) with specific user_id
    List<Transaction> findBySourceAccount_IdOrDestinationAccount_Id(
        Integer sourceAccountId,
        Integer destinationAccountId,
        Sort sort);

    // filter by transfer type by user
    @Query("""
    SELECT t FROM Transaction t
    WHERE (t.sourceAccount.id = :accountId OR t.destinationAccount.id = :accountId)
      AND t.transferType = :transferType
    """)
    List<Transaction> findByAccountAndTransferType(
        @Param("accountId") Integer accountId,
        @Param("transferType") String transferType);
}
