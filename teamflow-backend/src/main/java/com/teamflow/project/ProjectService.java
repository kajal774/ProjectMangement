package com.teamflow.project;

import com.teamflow.exception.ResourceNotFoundException;
import com.teamflow.project.dto.ProjectRequest;
import com.teamflow.project.dto.ProjectResponse;
import com.teamflow.security.CurrentUserProvider;
import com.teamflow.user.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

// Every method here follows the same shape:
//   1. Find out who's asking (CurrentUserProvider)
//   2. Do the database work (ProjectRepository)
//   3. Convert entities to response DTOs before returning
//
// All project access is scoped to the current user's own projects —
// there's no "get any project by id regardless of owner" method here,
// which is what stops one user from reading or editing another user's
// data just by guessing a UUID.
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CurrentUserProvider currentUserProvider;

    public ProjectService(ProjectRepository projectRepository, CurrentUserProvider currentUserProvider) {
        this.projectRepository = projectRepository;
        this.currentUserProvider = currentUserProvider;
    }

    public List<ProjectResponse> getProjects(String statusFilter) {
        User currentUser = currentUserProvider.getCurrentUser();

        List<Project> projects;
        if (statusFilter != null && !statusFilter.isBlank()) {
            ProjectStatus status = parseStatus(statusFilter);
            projects = projectRepository.findByOwnerAndStatus(currentUser, status);
        } else {
            projects = projectRepository.findByOwner(currentUser);
        }

        return projects.stream()
                .map(ProjectResponse::fromEntity)
                .toList();
    }

    public ProjectResponse getProject(UUID id) {
        Project project = findOwnedProjectOrThrow(id);
        return ProjectResponse.fromEntity(project);
    }

    public ProjectResponse createProject(ProjectRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        ProjectStatus status = parseStatus(request.getStatus());

        Project project = new Project(request.getName(), request.getDescription(), status, currentUser);
        projectRepository.save(project);

        return ProjectResponse.fromEntity(project);
    }

    public ProjectResponse updateProject(UUID id, ProjectRequest request) {
        Project project = findOwnedProjectOrThrow(id);

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(parseStatus(request.getStatus()));
        projectRepository.save(project);

        return ProjectResponse.fromEntity(project);
    }

    public void deleteProject(UUID id) {
        Project project = findOwnedProjectOrThrow(id);
        projectRepository.delete(project);
    }

    // Shared by getProject/updateProject/deleteProject: load the
    // project, then check it actually belongs to the current user.
    // 404 (not 403) on a mismatch is deliberate — it avoids confirming
    // to an attacker that a project with that id exists at all.
    private Project findOwnedProjectOrThrow(UUID id) {
        User currentUser = currentUserProvider.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Project not found");
        }

        return project;
    }

    private ProjectStatus parseStatus(String rawStatus) {
        try {
            return ProjectStatus.valueOf(rawStatus.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Status must be one of: PLANNING, ACTIVE, ON_HOLD, COMPLETED"
            );
        }
    }
}
