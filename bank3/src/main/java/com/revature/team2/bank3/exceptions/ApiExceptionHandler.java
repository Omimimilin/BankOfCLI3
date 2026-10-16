package com.revature.team2.bank3.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.revature.team2.bank3.rest.ResponseContract;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseContract<Void>> handleGenericException(Exception e) {
        return ResponseContract.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
}
