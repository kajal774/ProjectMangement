package com.teamflow.project;

import com.teamflow.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

// Relationship explained:
//   One User can own many Projects  ->  Project is the "many" side.
// That's why the foreign key (owner_id) lives on the projects table,
// and why the annotation here is @ManyToOne (many Projects to one User).
//
// FetchType.LAZY means Hibernate does NOT load the owner User row
// until you actually call project.getOwner() — it only fetches the
// owner_id by default. This avoids pulling a full User row (and its
// password hash) every single time we just want a project's fields.
// We default to LAZY everywhere unless there's a proven reason not to,
// per the "don't blindly use FetchType.EAGER" rule.
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // @Enumerated(EnumType.STRING) stores "ACTIVE" in the database
    // instead of the enum's ordinal position (0, 1, 2...), which
    // would silently break if we ever reordered the enum constants.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Project() {
    }

    public Project(String name, String description, ProjectStatus status, User owner) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.owner = owner;
        this.createdAt = Instant.now();
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

    public ProjectStatus getStatus() {
        return status;
    }

    public User getOwner() {
        return owner;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    // Simple setters for the fields an update (PUT) is allowed to
    // change. Notice id, owner, and createdAt have no setters at all —
    // that's deliberate, so it's structurally impossible to
    // accidentally reassign a project's owner from an update request.
    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
}
