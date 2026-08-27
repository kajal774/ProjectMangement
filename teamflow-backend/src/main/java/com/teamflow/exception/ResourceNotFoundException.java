package com.teamflow.exception;

// A small, specific exception instead of throwing a generic
// RuntimeException everywhere. Services throw this when a project or
// user isn't found; GlobalExceptionHandler catches it in exactly one
// place and turns it into a 404 response.
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
