package com.teamflow.auth.dto;

// Returned by both POST /api/auth/login and POST /api/auth/register.
// The frontend stores `token` for the Authorization header on future
// requests, and `user` to show things like the logged-in user's name.
public class AuthResponse {

    private String token;
    private UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public UserResponse getUser() {
        return user;
    }
}
