package com.teamflow.security;

import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

// This is the piece that runs on EVERY incoming HTTP request (it
// extends OncePerRequestFilter, which guarantees it runs exactly once
// per request even in complex filter chains). Its only job:
//
//   1. Look for an "Authorization: Bearer <token>" header
//   2. If present and valid, tell Spring Security "this request is
//      from this user" by populating the SecurityContext
//   3. If missing or invalid, do nothing and let the request continue
//      unauthenticated — SecurityConfig then decides whether that
//      endpoint requires authentication at all
//
// Full flow, tying this back to the JWT diagram in the design doc:
//   Frontend sends "Authorization: Bearer <token>"
//     -> this filter extracts the token
//     -> JwtService validates the signature + expiry
//     -> we load the User by the email stored in the token
//     -> SecurityContextHolder now has an authenticated principal
//     -> the request reaches ProjectController already "logged in"
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring("Bearer ".length());

        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtService.extractEmail(token);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Spring Security's UsernamePasswordAuthenticationToken is
            // the standard "this request is authenticated as X" object.
            // We don't check a password here — the JWT signature IS
            // the proof of identity at this point.
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    Collections.emptyList() // no role-based authorities in this prototype
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
