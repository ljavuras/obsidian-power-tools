/**
 * Dataview issue tracker
 * 
 * @author ljavuras <ljavuras.py@gmail.com>
 * ======================================== */

const obsidian    = input.obsidian;
const containerEl = dv.container;

const issueNote = getFile(dv.current().file.path);
const issueInfo = {
    ...dv.current().file.frontmatter,
    ctime: dv.current().file.ctime,
};

/** Returns a SVGElement */
const getIcon = {
    open: () => {
        let icon = obsidian.getIcon('circle-dot');
        icon.addClass("issue-open");
        return icon;
    },
    closed: () => {
        let icon = obsidian.getIcon('check-circle');
        icon.addClass("issue-closed");
        return icon;
    },
}

/**
 * Returns a TFile given a file path
 * @param {string} filePath - Path of the file
 * @returns {TFile}
 */
function getFile(filePath) {
    filePath = obsidian.normalizePath(filePath);

    let file = app.vault.getAbstractFileByPath(filePath);
    if (!file instanceof obsidian.TFile) {
        customJS.Error.log(
            `${filePath} is not a file.`
        )
    }

    return file;
}

class LabelChip {
    constructor(containerEl, labelText) {
        this.el = containerEl.createSpan({ cls: "label-chip" });
        this.el.setAttribute("label", labelText);
        this.el.innerHTML = labelText;
        // Add onclick listener to go back to issueTracker and filter by label
        this.el.onclick = () => {
            // if the location is used as explained in the examples this should work
            var issueTrackerPath = app.workspace.getActiveFile().parent.parent.path + "/Issue Tracker.md";
            var issueTrackerFile = getFile(issueTrackerPath);
            // Add frontmatter properties to keep track of the searched label and date when searched
            app.fileManager.processFrontMatter(issueTrackerFile, (frontmatter)=> {
                frontmatter["search"] = labelText;
                frontmatter["searchDate"] = new Date();
            });
            // Then open the issue tracker file
            app.workspace.getLeaf().openFile(issueTrackerFile);
        }
    }
}

class StatusDisplay {
    constructor(containerEl) {
        this.el = containerEl.createDiv({
            cls: `status-display status-${issueInfo.status}`
        });
        this.el.appendChild(getIcon[issueInfo.status]());
        this.el.appendChild(
            // Captalize first letter
            new Text(issueInfo.status.charAt(0).toUpperCase()
                   + issueInfo.status.slice(1))
        );
    }
}

class StatusToggle {
    constructor(containerEl) {
        this.el = containerEl.createEl('button', { cls:  "status-toggle" });
        if (issueInfo.status == "open") {
            this.el.addClass("status-open");
            this.el.innerHTML = "Close Issue";
        } else {
            this.el.addClass("status-closed");
            this.el.innerHTML = "Reopen Issue";
        }

        this.el.onclick = () => {
            app.fileManager.processFrontMatter(issueNote, (frontmatter) => {
                if (frontmatter.status == "open") {
                    frontmatter.status = "closed";
                } else {
                    frontmatter.status = "open";
                }
            })
        }
    }
}

containerEl.addClass("issueTracker-issue");

let LabelsEl = containerEl.createDiv({ cls: "issue-labelBar" });
for (const labelText of (issueInfo.labels || [])) {
    new LabelChip(LabelsEl, labelText);
}

let widgetsEl = containerEl.createDiv({ cls: "issue-widgets"});
new StatusDisplay(widgetsEl);
widgetsEl.createDiv({
    cls:  "issue-info",
    text: `#${issueInfo.issueNo} opened ${issueInfo
                .ctime.toRelativeCalendar({ locale: "en"})}`
    });
new StatusToggle(widgetsEl);
