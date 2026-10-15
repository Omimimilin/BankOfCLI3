package com.revature.team2.bank3.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;

class User {
     private int id;

     public int getId() {
          return id;
     }
}

class UserWriteDto {
}

@RestController
@RequestMapping("/api/users")
public class UserController {

     // Add User Service Here

     @GetMapping("/{id}")
     public User getUser(@PathVariable int id) {
          return new User();
     }

     @PostMapping
     public ResponseEntity<User> createUser(@Valid @RequestBody UserWriteDto dto) {
          User user = new User();
          return ResponseEntity
                    .created(
                              ServletUriComponentsBuilder
                                        .fromCurrentRequest()
                                        .path("/{id}")
                                        .buildAndExpand(user.getId())
                                        .toUri())
                    .body(user);
     }

}
