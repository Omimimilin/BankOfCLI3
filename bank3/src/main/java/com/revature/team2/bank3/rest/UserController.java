package com.revature.team2.bank3.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
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
@Tag(name = "Users", description = "Operations for managing users")
public class UserController {

     // Add User Service Here

     @GetMapping("/{id}")
     @Operation(summary = "Get a user by ID", description = "Returns the user for the supplied ID.")
     @ApiResponse(responseCode = "200", description = "User returned",
               content = @Content(schema = @Schema(implementation = User.class)))
     public User getUser(@Parameter(description = "ID of the user", example = "1") @PathVariable int id) {
          return new User();
     }

     @PostMapping
     @Operation(summary = "Create a user", description = "Creates a user and returns its resource location.",
               requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                         description = "User data to create", required = true,
                         content = @Content(schema = @Schema(implementation = UserWriteDto.class))))
     @ApiResponse(responseCode = "201", description = "User created",
               content = @Content(schema = @Schema(implementation = User.class)))
     @ApiResponse(responseCode = "400", description = "Request body failed validation")
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
