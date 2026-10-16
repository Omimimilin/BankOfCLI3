package com.revature.team2.bank3.service;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.UserNotFoundException;
import com.revature.team2.bank3.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository accountRepo;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository accountRepo) {
        this.accountRepo = accountRepo;
    }

    public User getAccount(int id) {
        User user = accountRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User record was not found"));
        log.info("User account retrieved for ID: {}", id);
        return user;
    }

}
