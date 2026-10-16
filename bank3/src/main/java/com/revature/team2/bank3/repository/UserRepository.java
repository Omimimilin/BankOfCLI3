package com.revature.team2.bank3.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.revature.team2.bank3.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByName(String name);

    Optional<User> findByName(String name);

    @Query("SELECT u.id FROM User u WHERE u.name = :name")
    Integer getIdByName(@Param("name") String name);

    boolean existsByUsername(String username);

    Integer getIdByUsername(String username);

    Optional<User> findByUsername(String username);
}
