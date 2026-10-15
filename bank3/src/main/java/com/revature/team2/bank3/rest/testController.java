package com.revature.team2.bank3.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testController {
    @GetMapping()
    public String helloWorld() {
        return "Hello world";
    }
}
