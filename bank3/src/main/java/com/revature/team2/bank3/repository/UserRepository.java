package com.revature.team2.bank3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.team2.bank3.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String username);
    Integer getIdByUsername(String username);
}