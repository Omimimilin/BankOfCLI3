package com.revature.team2.bank3.domain;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "transaction")
public class Transaction {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @DecimalMin("0")
    @Column(name="amount", precision = 20, scale = 2)
    private BigDecimal amount;

    @Size(max=20)
    @Column(name="transfer_type", length = 20)
    private String transfer_type;

    @Column(name="timestamp", nullable = false)
    private Instant timestamp;
    
    // relationship with account (many transactions from one account)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_account", nullable = false)
    private User sourceAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_account", nullable = true)
    private User destinationAccount;

    public Transaction() {}

    public Transaction(BigDecimal amount, String transferType, Instant timestamp, User sourceAccountId, User destinationAccountId) {
        this.amount = amount;
        this.transfer_type = transferType;
        this.timestamp = timestamp;
        this.sourceAccount = sourceAccountId;
        this.destinationAccount = destinationAccountId;
    }

    public Integer getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getTransferType() {
        return transfer_type;
    }

    public void setTransferType(String transfer_type) {
        this.transfer_type = transfer_type;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public User getSourceAccount() {
        return sourceAccount;
    }

    public void setSourceAccount(User source_account) {
        this.sourceAccount = source_account;
    }

    public User getDestinationAccount() {
        return destinationAccount;
    }

    public void setDestinationAccount(User destination_account) {
        this.destinationAccount = destination_account;
    }
    
}
