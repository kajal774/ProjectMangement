package com.teamflow.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

// This is the ENTITY - it represents a row in the "users" table.
// It is NOT what we return from the API directly (see auth/dto/UserResponse.java
// for that). Keeping them separate means we control exactly what leaves
// the server — the password hash, for example, never gets serialized to JSON
// because UserResponse simply doesn't have a password field.
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    // unique = true creates a database-level constraint, so two users
    // can never share an email even under concurrent requests.
    @Column(nullable = false, unique = true)
    private String email;

    // This stores a BCrypt HASH, never the plain-text password.
    // Hashing happens in AuthService before the User is saved.
    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // JPA requires a no-args constructor to build entities from
    // database rows via reflection.
    protected User() {
    }

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = Instant.now();
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
