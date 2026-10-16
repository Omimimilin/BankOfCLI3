package com.revature.team2.bank3.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.dto.user.UserResponseDto;
import com.revature.team2.bank3.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin(origins = "*") // TODO: setup CORS correctly
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Operations for managing users")
public class UserController {

     private UserService userService;

     public UserController(UserService userService) {
          this.userService = userService;
     }

     @GetMapping()
     @Operation(summary = "Get account details", description = "Get the full account details of a user. The request must have a JWT attached")
     public ResponseEntity<ResponseContract<UserResponseDto>> me() {
          // TODO: implement user service to find user

          UserResponseDto user = new UserResponseDto(null, null, null, null);
          return ResponseContract.success(HttpStatus.OK, user);
     }

     @GetMapping("/{username}")
     @Operation(summary = "Get a user's ID by their username", description = "Returns the user ID the user with the supplied username")
     public ResponseEntity<ResponseContract<Integer>> getIdByUsername(
               @Parameter(description = "Username of the user", example = "1") @PathVariable String username) {
          // TODO: implement user service to find user by username

          return ResponseContract.success(HttpStatus.OK, null);
     }
}
