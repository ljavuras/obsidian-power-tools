<%*
/**
 * Dataview issue tracker
 * 
 * @author ljavuras <ljavuras.py@gmail.com>
 * ======================================== */

// Abort templater parsing process if `window.newIssueInfo` doesn't exist
if (!window.newIssueInfo) {
    new tp.obsidian.Notice(
        "Aborted.\n" +
        "`window.newIssueInfo` doesn't exist.\n" +
        "Issue template can't be used directly. Use Issue Tracker to create issue instead."
    );
    return;
}

/**
 * `window.newIssueInfo` is a `IssueInfoExporter` object from `IssueTracker/view.js`,
 * refer to the source code for details.
 */
let issueInfo = window.newIssueInfo;
-%>
---
issueNo: <% issueInfo.issueNo %>
status: open
labels:<% issueInfo.labelsYAML %>
---

###### <% issueInfo.projectNoteLink %> / <% issueInfo.issueTrackerLink %>
# <% issueInfo.title %>
```dataviewjs
dv.view("Issue Tracker/IssueTracker/Issue", { obsidian: obsidian });
```

<% tp.file.cursor() %>
