package com.example.springbootposbackend.exception;

public class CustomException extends  RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}
