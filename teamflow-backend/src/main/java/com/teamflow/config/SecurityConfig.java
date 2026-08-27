package com.teamflow.config;

import com.teamflow.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// This class wires together everything security-related:
//   - which endpoints require a logged-in user
//   - where our JwtAuthenticationFilter runs in the chain
//   - CORS rules so the React dev server (a different origin) is
//     allowed to call this API from the browser
//   - the PasswordEncoder bean AuthService uses to hash passwords
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // The frontend's origin, injected from application.yml so it's
    // easy to change per environment instead of hardcoded here.
    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt is the standard choice: it's a one-way hash with a
        // built-in random salt per password, and it's deliberately
        // slow (to resist brute-force attempts). We never store or
        // compare plain-text passwords anywhere in this app.
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF protection matters for cookie-based sessions.
                // We use stateless JWT auth instead (no session cookie),
                // so CSRF protection doesn't apply here.
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // STATELESS: Spring Security will never create or read
                // an HTTP session. Every request must prove who it is
                // via the JWT, every time — that's what makes this API
                // horizontally scalable without shared session storage.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                // Run our JWT filter BEFORE Spring's built-in username/
                // password filter, since we're not using that flow at all.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
