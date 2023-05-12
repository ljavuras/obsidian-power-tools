<%*
/**
 * Dataview issue tracker
 * 
 * @author ljavuras <ljavuras.py@gmail.com>
 * ======================================== */
-%>
# [[<% tp.file.folder() %>]] / Issues
```dataviewjs
await dv.view("Issue Tracker/IssueTracker", {
    obsidian: obsidian,
    /** Options here */

    // Name of your project, will be used as display name for your project note
    // project_name: <your project name>

    // Title of your project note this issue tracker associates to
    // project_note: <project note name>

    // Sub-folder where issue notes should go
    // issue_folder: "issues/",

    // Template name, a template that exists in your templater folder, must include '.md'
    // issue_template: "note.issue-tracker.issue.md",

    // Default query that shows up in the search bar
    // default_query: "is:open",
});
```