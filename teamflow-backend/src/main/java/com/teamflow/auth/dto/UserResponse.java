package com.teamflow.auth.dto;

import com.teamflow.user.User;
import java.util.UUID;

// Deliberately has no password field at all — not even the hash.
// This is the object that gets embedded in AuthResponse and sent to
// the frontend, so leaving passwordHash out here is what guarantees
// it can never leak over the API by accident.
public class UserResponse {

    private UUID id;
    private String name;
    private String email;

    public UserResponse(UUID id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static UserResponse fromEntity(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
