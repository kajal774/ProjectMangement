package com.teamflow.project;

// A plain Java enum. Hibernate stores this as a string column
// (see @Enumerated(EnumType.STRING) on Project.status) so the
// database contains readable values like 'ACTIVE' instead of
// opaque numbers — that matters if you ever query the table by hand.
public enum ProjectStatus {
    PLANNING,
    ACTIVE,
    ON_HOLD,
    COMPLETED
}
