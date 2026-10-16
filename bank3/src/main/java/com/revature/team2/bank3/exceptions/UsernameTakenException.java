package com.revature.team2.bank3.exceptions;

public class UsernameTakenException extends RuntimeException {

    public UsernameTakenException(String message) {
        super(message);
    }

    public UsernameTakenException(Throwable cause) {
        super(cause);
    }

    public UsernameTakenException(String message, Throwable cause) {
        super(message, cause);
    }

}
