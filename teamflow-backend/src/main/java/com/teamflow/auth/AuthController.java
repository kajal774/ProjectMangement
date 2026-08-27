package com.teamflow.auth;

import com.teamflow.auth.dto.AuthResponse;
import com.teamflow.auth.dto.LoginRequest;
import com.teamflow.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Both endpoints here are listed under "/api/auth/**" as permitAll()
// in SecurityConfig — you need to be able to log in BEFORE you have a
// token, so these two routes are the one place in the API that skips
// the JWT filter's authentication check.
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
