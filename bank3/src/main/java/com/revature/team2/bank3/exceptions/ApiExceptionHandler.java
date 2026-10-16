package com.revature.team2.bank3.exceptions;

import com.revature.team2.bank3.rest.ResponseContract;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// @RestControllerAdvice
// public class ApiExceptionHandler {
// @ExceptionHandler(Exception.class)
// public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception e)
// {
// ApiResponse<Void> res = ApiResponse.failure("An internal error occurred.");
// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
// }
// }
