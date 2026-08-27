package com.teamflow.project;

import com.teamflow.project.dto.ProjectRequest;
import com.teamflow.project.dto.ProjectResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// Every route here requires a valid JWT (see SecurityConfig:
// "anyRequest().authenticated()" for everything outside /api/auth/**).
// The controller itself doesn't check who the user is — that's
// ProjectService's job via CurrentUserProvider — this class only
// translates HTTP <-> Java method calls.
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // GET /api/projects              -> all of the current user's projects
    // GET /api/projects?status=ACTIVE -> filtered to one status
    // `required = false` makes the query param optional; it's simply
    // null when the frontend doesn't send it.
    @GetMapping
    public List<ProjectResponse> getProjects(
            @RequestParam(required = false) String status
    ) {
        return projectService.getProjects(status);
    }

    @GetMapping("/{id}")
    public ProjectResponse getProject(@PathVariable UUID id) {
        return projectService.getProject(id);
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse response = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequest request
    ) {
        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build(); // 204, matches the frontend's expectation
    }
}
