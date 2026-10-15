package com.revature.team2.bank3.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BankApiResponse<T> {
    private boolean success;
    private T data;
    private List<String> errors;

    private BankApiResponse(boolean success, T data, List<String> errors) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }

    public static <T> ResponseEntity<BankApiResponse<T>> success(HttpStatus status, T data) {
        return ResponseEntity.status(status).body(new BankApiResponse<>(true, data, null));
    }

    public static <T> ResponseEntity<BankApiResponse<T>> error(HttpStatus status, String errorMessage) {
        return ResponseEntity.status(status).body(new BankApiResponse<>(false, null, List.of(errorMessage)));
    }

    public static <T> ResponseEntity<BankApiResponse<T>> error(HttpStatus status,
            java.util.List<String> errorMessages) {
        return ResponseEntity.status(status).body(new BankApiResponse<>(false, null, errorMessages));
    }

    public boolean isSuccess() {
        return this.success;
    }

    public T getData() {
        return this.data;
    }

    public List<String> getErrors() {
        return this.errors;
    }
}