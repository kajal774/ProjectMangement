package com.teamflow.project;

import com.teamflow.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    // Backs "GET /api/projects" with no filter — every project
    // belonging to the signed-in user.
    List<Project> findByOwner(User owner);

    // Backs "GET /api/projects?status=ACTIVE" — Spring Data reads the
    // method name (findByOwnerAndStatus) and builds:
    //   SELECT * FROM projects WHERE owner_id = ? AND status = ?
    List<Project> findByOwnerAndStatus(User owner, ProjectStatus status);
}
