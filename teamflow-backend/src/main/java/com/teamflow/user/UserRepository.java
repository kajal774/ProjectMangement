package com.teamflow.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

// Spring Data JPA generates the implementation of this interface at
// startup. We never write the SQL or the implementation class
// ourselves — Spring reads the method name and derives the query:
//
//   findByEmail(String email)
//     -> SELECT * FROM users WHERE email = ?
//
// JpaRepository<User, UUID> already gives us save(), findById(),
// findAll(), deleteById(), etc. for free — this interface only adds
// the ONE extra query method we actually need beyond that.
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
