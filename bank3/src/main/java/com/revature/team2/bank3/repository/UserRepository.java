package com.revature.team2.bank3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.team2.bank3.domain.User;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    String getIdByUsername(String username);
}
