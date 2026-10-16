package com.revature.team2.bank3.service;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.UserNotFoundException;
import com.revature.team2.bank3.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository accountRepo;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User getUserById(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User record was not found"));
        log.info("User account retrieved for ID: {}", id);
        return user;
    }

    public User getUserByUsername(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User record was not found"));
        return user;
    }

    public boolean existsByUsername(String username) {
        return this.userRepo.existsByUsername(username);
    }

    @Transactional
    public User createUser(String username, String name, String hashedPin) {
        User newUser = new User(
                username,
                name,
                hashedPin,
                new BigDecimal(0));
        userRepo.save(newUser);
        return newUser;
    }
}
