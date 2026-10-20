package com.revature.team2.bank3.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseContract<T> {
    private final boolean success;
    private final T data;
    private final List<String> errors;

    private ResponseContract(boolean success, T data, List<String> errors) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }

    public static <T> ResponseEntity<ResponseContract<T>> success(HttpStatus status, T data) {
        return ResponseEntity.status(status).body(new ResponseContract<>(true, data, null));
    }

    public static <T> ResponseEntity<ResponseContract<T>> error(HttpStatus status, String errorMessage) {
        return ResponseEntity.status(status).body(new ResponseContract<>(false, null, List.of(errorMessage)));
    }

    public static <T> ResponseEntity<ResponseContract<T>> error(HttpStatus status,
            java.util.List<String> errorMessages) {
        return ResponseEntity.status(status).body(new ResponseContract<>(false, null, errorMessages));
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