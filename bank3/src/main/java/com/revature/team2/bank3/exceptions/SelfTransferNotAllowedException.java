package com.revature.team2.bank3.exceptions;

public class SelfTransferNotAllowedException extends RuntimeException {

    public SelfTransferNotAllowedException(String message) {
        super(message);
    }

    public SelfTransferNotAllowedException(Throwable cause) {
        super(cause);
    }

    public SelfTransferNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }

}
