package com.revature.team2.bank3.service;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.exceptions.UserNotFoundException;
import com.revature.team2.bank3.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository accountRepo;

    public UserService(UserRepository accountRepo) {
        this.accountRepo = accountRepo;
    }

    public User getAccount(int id) {
        User user = accountRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User record was not found"));
        return user;
    }

}
