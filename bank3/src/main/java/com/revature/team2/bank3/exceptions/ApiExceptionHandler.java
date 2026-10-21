package com.revature.team2.bank3.exceptions;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.revature.team2.bank3.rest.ResponseContract;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ResponseContract<Void>> handleException(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(violation -> String.format("%s: %s",
                        violation.getPropertyPath(),
                        violation.getMessage()))
                .collect(Collectors.joining(", "));
        return ResponseContract.error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseContract<Void>> handleException(Exception e) {
        return ResponseContract.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
}
