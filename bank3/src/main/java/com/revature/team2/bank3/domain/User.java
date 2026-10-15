package com.revature.team2.bank3.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity 
@Table(name="user")

@Schema(description = "A bank account user")
public class User {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique user ID", accessMode = Schema.AccessMode.READ_ONLY)
    private Integer id;

    @Size(max=20)
    @Column(name="username", length = 20)
    private String username;

    @Size(max=20)
    @Column(name="name", length = 20)
    @Schema(description = "The user's full name", example = "John Doe")
    private String name;

    @Size(max=20)
    @Column(name="pin", length = 20)
    @Schema(description = "The user's PIN", example = "1234")
    private String pin;

    @DecimalMin("0")
    @Column(name="balance", precision = 20, scale = 2)
    @Schema(description = "Current account balance", example = "1000.00")
    private BigDecimal balance;

    // relationship with transaction (one account can have many transactions)
    @OneToMany(mappedBy = "sourceAccount")
    private List<Transaction> transactions = new ArrayList<>();

    public User(Integer id, String username, String name, String pin, BigDecimal balance) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.pin = pin;
        this.balance = balance;
    }

    // required for hibernate
    public User() {}

    public Integer getId() {
        return id;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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