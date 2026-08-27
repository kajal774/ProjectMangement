package com.teamflow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// The simplest possible test: does the whole Spring application
// context start up without errors (all beans wire together, security
// config is valid, JPA can connect, etc)? If this fails, something is
// misconfigured before you even get to testing individual features.
@SpringBootTest
class TeamflowApplicationTests {

    @Test
    void contextLoads() {
    }
}
