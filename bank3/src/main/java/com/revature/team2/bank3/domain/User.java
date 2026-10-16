package com.revature.team2.bank3.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

@Entity 
@Table(name="users")

public class User {

    @Id 
    private Integer id;

    @Size(max=20)
    @Column(name="name", length = 20)
    private String name;

    @Size(max=20)
    @Column(name="pin", length = 20)
    private String pin;

    @DecimalMin("0")
    @Column(name="balance", precision = 20, scale = 2)
    private BigDecimal balance;

    // relationship with transaction (one account can have many transactions)
    @OneToMany(mappedBy = "sourceAccount")
    private List<Transaction> transactions = new ArrayList<>();

    public User(Integer id, String name, String pin, BigDecimal balance) {
        this.id = id;
        this.name = name;
        this.pin = pin;
        this.balance = balance;
    }

    // required for hibernate
    public User() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
    
}