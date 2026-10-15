package com.revature.team2.bank3.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.team2.bank3.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
