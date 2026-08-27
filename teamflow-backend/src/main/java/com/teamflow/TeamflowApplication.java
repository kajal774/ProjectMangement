package com.teamflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication is three annotations in one:
// - @Configuration: this class can define beans
// - @EnableAutoConfiguration: Spring Boot wires up sensible defaults
//   (embedded Tomcat, JPA, etc.) based on what's on the classpath
// - @ComponentScan: Spring looks for @Component/@Service/@Repository/
//   @RestController classes in this package and sub-packages
public class TeamflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamflowApplication.class, args);
    }
}
