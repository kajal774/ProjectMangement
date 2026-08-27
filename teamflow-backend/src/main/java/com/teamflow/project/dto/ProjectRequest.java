package com.teamflow.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// What the client SENDS when creating or updating a project
// (POST /api/projects and PUT /api/projects/{id} both use this).
//
// The @NotBlank/@Size/@NotNull annotations are read by
// spring-boot-starter-validation when the controller method has
// @Valid on this parameter. If validation fails, Spring throws a
// MethodArgumentNotValidException before the controller code even
// runs — see GlobalExceptionHandler for how that becomes a 400.
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 3, message = "Project name must be at least 3 characters")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Status is required")
    private String status; // validated + converted to the enum in the service

    public ProjectRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
