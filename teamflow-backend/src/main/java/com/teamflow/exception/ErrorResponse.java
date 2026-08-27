package com.teamflow.exception;

import java.time.Instant;
import java.util.Map;

// One consistent JSON shape for every error the API returns, e.g.:
// {
//   "status": 404,
//   "message": "Project not found",
//   "timestamp": "2026-08-27T10:15:00Z",
//   "fieldErrors": null
// }
//
// fieldErrors is only populated for validation failures (400s), where
// we want to tell the frontend WHICH field was invalid and why.
public class ErrorResponse {

    private int status;
    private String message;
    private Instant timestamp;
    private Map<String, String> fieldErrors;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public ErrorResponse(int status, String message, Map<String, String> fieldErrors) {
        this(status, message);
        this.fieldErrors = fieldErrors;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
