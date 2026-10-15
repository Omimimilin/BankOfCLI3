package com.revature.team2.bank3.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


class User {
     private int id;

     public int getId() {
          return id;
     }
}


@RestController
@RequestMapping("/api/users")
public class UserController {

     // Add User Service Here

     @GetMapping("/{id}")
     public User getUser(@PathVariable int id) {
          return new User();
     }
}
