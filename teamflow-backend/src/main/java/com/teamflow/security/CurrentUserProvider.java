package com.teamflow.security;

import com.teamflow.exception.ResourceNotFoundException;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// JwtAuthenticationFilter put the user's EMAIL into the
// SecurityContext (see the UsernamePasswordAuthenticationToken it
// builds). Any service that needs to know "who is making this
// request" — like ProjectService, to scope projects to their owner —
// calls getCurrentUser() here instead of touching SecurityContextHolder
// directly. One place to change if the auth mechanism ever changes.
@Component
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user no longer exists"));
    }
}
