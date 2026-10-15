package com.revature.team2.bank3.rest;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private List<String> errors;

    private ApiResponse(boolean success, T data, List<String> errors) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static <T> ApiResponse<T> failure(String error) {
        return new ApiResponse<>(false, null, List.of(error));
    }

    public static <T> ApiResponse<T> failure(List<String> errors) {
        return new ApiResponse<>(false, null, errors);
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