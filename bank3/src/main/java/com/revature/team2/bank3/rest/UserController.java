package com.revature.team2.bank3.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.revature.team2.bank3.domain.User;
import com.revature.team2.bank3.dto.user.UserResponseDto;
import com.revature.team2.bank3.exceptions.UserNotFoundException;
import com.revature.team2.bank3.security.JwtUtil;
import com.revature.team2.bank3.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Operations for managing users")
public class UserController {

     private final UserService userService;
     private final JwtUtil jwtUtil;

     public UserController(UserService userService, JwtUtil jwtUtil) {
          this.userService = userService;
          this.jwtUtil = jwtUtil;
     }

     @GetMapping("/me")
     @Operation(summary = "Get your account details", description = "Get the full account details of the user with the attached JWT in the Authorization header")
     public ResponseEntity<ResponseContract<UserResponseDto>> me(
               @RequestHeader(value = "Authorization", required = true) String authorization) {
          String jwt = authorization.split(" ")[1];
          String username = this.jwtUtil.extractUsername(jwt);
          User user = userService.getUserByUsername(username);
          UserResponseDto responseDto = new UserResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getBalance());
          return ResponseContract.success(HttpStatus.OK, responseDto);
     }

     @GetMapping("")
     @Operation(summary = "Get details of another user by their username", description = "Get details of another user by their username")
     public ResponseEntity<ResponseContract<UserResponseDto>> doesUserExist(
               @Parameter(description = "Username of the user", example = "superman") @RequestParam String username) {
          try {
               User user = userService.getUserByUsername(username);
               UserResponseDto responseDto = new UserResponseDto(
                         user.getId(),
                         user.getUsername(),
                         user.getName(),
                         user.getBalance());
               return ResponseContract.success(HttpStatus.OK, responseDto);
          } catch (UserNotFoundException e) {
               return ResponseContract.error(HttpStatus.NOT_FOUND,
                         String.format("Username `%s` doesn't exist.", username));
          }
     }
}
