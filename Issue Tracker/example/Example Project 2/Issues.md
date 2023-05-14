# [[Issue Tracker/example/Example Project 2/README|Project: Custom Name]] / Issues
```dataviewjs
await dv.view("Issue Tracker/IssueTracker", {
    obsidian: obsidian,

    /** Options here */

    // Name of project, used as display text of project note's link
    project_name: "Project: Custom Name",

    // Title of project note, used to find the project note
    project_note: "Example Project 2/README",

    // Sub-folder where issue notes go
    issue_folder: "30-39 Bugs and issues/31.01 issues/",

    // Template name, a template that exists in your templater folder
    // issue_template: "note.issue-tracker.issue.md",

    // Default query that shows up in the search bar
    // default_query: "is:open",
});
```