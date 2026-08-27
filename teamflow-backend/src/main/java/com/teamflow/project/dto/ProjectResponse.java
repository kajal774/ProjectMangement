package com.teamflow.project.dto;

import com.teamflow.project.Project;

import java.time.Instant;
import java.util.UUID;

// What the client RECEIVES. This is the "DTO = API representation"
// idea from the project's design doc: the Project entity has an
// `owner` field (a whole User object with a password hash), but this
// response only exposes what the frontend actually needs.
public class ProjectResponse {

    private UUID id;
    private String name;
    private String description;
    private String status;
    private Instant createdAt;

    public ProjectResponse(UUID id, String name, String description, String status, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }

    // A static factory method that knows how to build a ProjectResponse
    // from a Project entity. Keeping the mapping here (rather than
    // scattering `new ProjectResponse(p.getId(), ...)` across the
    // service) means there's exactly one place that defines "how an
    // entity becomes a response".
    public static ProjectResponse fromEntity(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus().name(),
                project.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
