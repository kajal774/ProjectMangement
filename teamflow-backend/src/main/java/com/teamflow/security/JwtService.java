package com.teamflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

// Everything JWT-related lives in this one class: creating a token at
// login/register, and reading a token back out on later requests.
//
// A JWT has three parts (header.payload.signature). We don't hand-roll
// any of that — the jjwt library builds and parses it. What we control
// is what goes IN the payload (the user's email, an expiry time) and
// the secret key used to sign it.
@Service
public class JwtService {

    // Injected from application.yml (see jwt.secret there), which in
    // turn reads from the JWT_SECRET environment variable. Never
    // hardcode a real secret in source control.
    private final SecretKey signingKey;
    private final long expirationMillis;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMillis
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMillis = expirationMillis;
    }

    // Called once, right after a successful login/register.
    // The "subject" of the token is the user's email — that's the
    // piece of information we'll want back out later to identify
    // who's making a request.
    public String generateToken(String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    // Called on every subsequent request by JwtAuthenticationFilter.
    // Throws an exception (caught in the filter) if the token is
    // malformed, expired, or signed with a different key than ours.
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
