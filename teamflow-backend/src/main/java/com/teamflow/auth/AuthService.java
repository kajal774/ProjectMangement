package com.teamflow.auth;

import com.teamflow.auth.dto.AuthResponse;
import com.teamflow.auth.dto.LoginRequest;
import com.teamflow.auth.dto.RegisterRequest;
import com.teamflow.auth.dto.UserResponse;
import com.teamflow.security.JwtService;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Business logic for the two auth endpoints. The controller stays
// thin (just handles HTTP) and delegates the actual work here — that
// separation is what makes this logic reusable and easy to unit test
// without spinning up a web server.
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register flow:
    //   1. Reject if the email is already taken
    //   2. Hash the plain-text password (never store it as-is)
    //   3. Save the new User row
    //   4. Immediately issue a JWT, same as login — so the frontend
    //      can log the user straight in after registering
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with that email already exists");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getEmail(), passwordHash);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    // Login flow:
    //   1. Look up the user by email
    //   2. Compare the submitted password against the stored hash
    //      (passwordEncoder.matches hashes the input the same way and
    //      compares — we never decrypt the stored hash, because BCrypt
    //      hashing is one-directional by design)
    //   3. If both checks pass, issue a JWT
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}
