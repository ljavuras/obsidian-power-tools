/**
 * Dataview issue tracker
 * 
 * @author ljavuras <ljavuras.py@gmail.com>
 * ======================================== */

/** Container HTMLElement of Issue Tracker */
const containerEl = dv.container;

/** User options passed through dv.view("path/to/IssueTracker", options) */
const user_options = input;

/** Expose Obsidian API */
const obsidian = input.obsidian;

/**
 * Options
 */
const default_options = {
    
    /** Fallback for project name, use project note, or folder name if not supplied */
    project_name: user_options?.project_note? user_options.project_note :
                                              getCurrentFolderName(),

    /** Fallback for project note, use project name, or folder name if not supplied */
    project_note: user_options?.project_name? user_options.project_name :
                                              getCurrentFolderName(),

    /** Sub-folder where issue notes are */
    issue_folder: "issues/",

    /** Template name, a template that exists in templater folder, must include '.md' */
    issue_template: "note.issue-tracker.issue.md",

    /** Default query that shows up in the search bar */
    default_query: "is:open",
};

const options = {
    ...default_options,
    ...(user_options || {}),
};

/**
 * Utilities
 */
function getCurrentFolderPath() {
    return dv.current().file.folder;
}

function getCurrentFolderName() {
    // Return the string after the last '/', if no '/' is found, return full path
    return getCurrentFolderPath()?.match(/\/([^\/]+)$/)?.[1]
        || getCurrentFolderPath();
}

function resolvePath(basepath, relative_path) {
    return obsidian.normalizePath(
        `${basepath}/${relative_path}`
    );
}

// Special characters that aren't allowed for filename in Obsidian:
// *"\/<>:|?#^[]
const specialCharSet      = "*\"\\/<>:|?#^[]";
const specialCharSetRegex = /[*"\\/<>:|?#^[\]]/;

/**
 * Checks if a string is a valid filename in Obsidian
 * @param {string} filename - Name of a potential new file
 * @returns {boolean}
 */
function isValidFilename(filename) {
    return !specialCharSetRegex.test(filename);
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
        new obsidian.Notice(
            `${filePath} is not a file.`
        )
    }

    return file;
}

/**
 * Gets a best matching TFile by file name
 * @param {string} fileName - Name of file, without extension
 * @returns {TFile} Obsidian TFile object
 */
function getFileByName(fileName) {
    if (!fileName) return;
    return app.metadataCache.getFirstLinkpathDest(fileName, "");
}

/**
 * Get contents of a file
 * @param {string | TFile} file - Path or object of a file
 * @returns {string} Contents of the file
 */
async function getFileContent(fileId) {
    let tfile;

    // fileId is a path
    if (typeof fileId == 'string') {
        tfile = getFile(fileId);

    // fileId is TFile
    } else if (fileId instanceof obsidian.TFile) {
        tfile = fileId;

    // Handle error
    } else {
        new obsidian.Notice(
            "Cannot get file content.\n" +
            "Invalid parameter passed to Obsidian.getFileContent"
        )
        return;
    }

    return await app.vault.cachedRead(tfile);
}

/**
 * Opens a file in editor, creates the file if it doesn't exist
 * @param {TFile|string} file - File or path to be opened in editor
 * @param {string} mode - Open mode, see options in `modeMap`
 */
async function openFile(file, mode = "current") {
    let modeMap = {
        "current":     [false],
        "new-tab":     [true],
        "split-right": ["split"],
        "split-down":  ["split", "horizontal"],
        "new-window":  ["window"],
    };

    // file type check
    if (!(file instanceof obsidian.TFile) &&
        typeof file != "string") {
        new obsidian.Notice(
            "file should either be type TFile or string, but it is type " +
            typeof file + "."
        );
        return;
    }

    // Get TFile from path
    if (typeof file == "string") {
        if (!this.existsFile(file)) {
            file = await app.vault.create(file, '');
        } else {
            file = app.vault.getAbstractFileByPath(file);
        }
    }

    // Open file with appropriate mode
    let activeLeaf = app.workspace.getLeaf(...modeMap[mode]);
    await activeLeaf.openFile(file);
}

function existsFolder(folderPath) {
    folderPath = obsidian.normalizePath(folderPath);
    return app.vault.getAbstractFileByPath(folderPath) instanceof obsidian.TFolder;
}

/**
 * Creates a folder if the folder doesn't exist
 * @param {string} folderPath - Path of the folder
 */
async function createFolder(folderPath) {
    if (!await app.vault.exists(folderPath)) {
        await app.vault.createFolder(folderPath);
    }
}

/**
 * A tooltip that shows under parentEl
 */
class Tooltip {
    /**
     * Attaches a tooltip to a HTMLElement
     * @param {HTMLElement} parentEl - The element that the tooltip attaches to
     * @param {boolean} isError - If the tooltip notifies an error
     */
    constructor(parentEl, isError) {
        this.parentEl = parentEl;
        this.isError  = isError;

        this.el = createEl('div', { cls: "tooltip" });
        this.el.textNode = this.el.appendChild(new Text(""));
        this.el.createEl('div', { cls: "tooltip-arrow" });
    }

    show(message) {
        this.el.textNode.nodeValue = message;
        if (this.isError) { this.el.addClass("mod-error") }

        let parentRect = this.parentEl.getBoundingClientRect();
        this.el.setCssProps({
            "top":  `${parentRect.bottom + 8}px`,
            "left": `${parentRect.left + (parentRect.width/2)}px`,
        });

        this.mount();
    }

    hide() {
        this.unmount();
    }

    mount() {
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(() => { this.unmount() }, 2500);
        document.body.appendChild(this.el);
    }

    unmount() {
        this.el.parentElement?.removeChild(this.el);
    }
}

/**
 * Templater plugin and its API
 */
const templater = {
    plugin: app.plugins.plugins["templater-obsidian"],

    settings: {
        // Folder where templates are stored
        folder: app.plugins.plugins["templater-obsidian"]
                .settings.templates_folder,
    },
    
    /**
     * Creates a new file from template
     * @param {string} filePath - Path of the new file
     * @param {string} templateName - Name of the template
     * @returns {TFile} The created new file
     */
    async createNewFileFromTemplate(filePath, templateName) {
        let templatePath = obsidian.normalizePath(
            `${this.settings.folder}/${templateName}`
        );
        
        // Create new file with template as its contents
        const newFile = await app.vault.create(
            filePath,
            await getFileContent(templatePath)
        );

        // Parse template with templater
        await this.plugin.templater.overwrite_file_commands(newFile);

        return newFile;
    }
}

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

class IssueTracker {
    constructor(options) {
        this.config = {
            issueTracker: {
                default_query: options.default_query,

                /** A dataview link: [[path/to/issueTracker.md|Issues]] */
                link: dv.current().file.link.withDisplay("Issues"),
            },
            project: {
                name: options.project_name,

                /** A dataview link: [[path/to/ProjectNote.md|project_name]] */
                /** Fallbacks to options.project_name */
                link: getFileByName(options.project_note)?
                    dv.page(getFileByName(options.project_note)?.path
                        )?.file.link
                        .withDisplay(options.project_name) :
                    options.project_name,
            },
            issues: {
                folder_path:   resolvePath(getCurrentFolderPath(), options.issue_folder),
                template_name: options.issue_template,
            },
        };

        this.issueList = new this.IssueList(this);
        this.filter    = new this.Filter(this);
        this.searchBar = new this.SearchBar(this);

        this.el = createDiv({ cls: "issueTracker" });
        this.searchBar.render(this.el);
    }

    async render(containerEl) {
        containerEl.appendChild(this.el);
        await this.issueList.render(this.el);
    }

    Filter = class {
        constructor(issueTracker) {
            this.issueTracker = issueTracker;
            this.sortBy = "Newest";
        }

        async getStatusCount(status) {
            let query_without_status = structuredClone(this.query);
            delete query_without_status.status;

            return (await this.queryIssues(
                    this.issueTracker.issueList.issues,
                    query_without_status
                ))
                .filter((issue) => issue.status == status )
                .length;
        }

        submitQuery(query) {
            this.query = query;
            this.issueTracker.issueList.refresh();
        }

        /**
         * Filter issues with a query object
         * @param {Issue[]} issues 
         * @param {Object} query - Query object
         * @returns {Issue[]} Filtered issues
         */
        async queryIssues(issues, query) {

            // Read issue contents for filtering
            if (query.content.length) {  // Skip if query doesn't query content
                for (let issue of issues) {
                    if (!issue.content) {
                        // Cache file content, stript frontmatter
                        issue.content = (await app.vault.cachedRead(issue.file))
                            .replace(/^---\n([\s\S]*?\n|)---(\n|$)/, '');
                    }
                }
            }
            
            return issues
                .filter((issue) => {
                    if (query?.status) {
                        if (issue.status != this.query.status) { return false; }
                    }
                    for (let label of query.labels) {
                        if (!issue.labels.includes(label)) { return false; }
                    }
                    for (let title of query.title) {
                        if (!issue.name.toLowerCase().includes(title.toLowerCase())) {
                            return false;
                        }
                    }
                    for (let content of query.content) {
                        if (!issue.name.toLowerCase().includes(content.toLowerCase()) &&
                            !issue.content.toLowerCase().includes(content.toLowerCase())) {
                            return false;
                        }
                    }
                    return true;
                });
        }

        /**
         * Filter and sort issues with this.query
         * @param {Issue[]} issues 
         * @returns {Issue[]} Filtered and sorted issues
         */
        async filterIssues(issues) {
            return (await this.queryIssues(issues, this.query))
                .sort(issue => issue, "asc", (issue1, issue2 )=> {
                    switch (this.sortBy) {
                        case "Newest":
                            return issue2.ctime.ts - issue1.ctime.ts;
                        case "Oldest":
                            return issue1.ctime.ts - issue2.ctime.ts;
                        case "Recently updated":
                            return issue2.mtime.ts - issue1.mtime.ts;
                        case "Least recently updated":
                            return issue1.mtime.ts - issue2.mtime.ts;
                    }
                });
        }
    }

    SearchBar = class {
        constructor(issueTracker) {
            this.issueTracker = issueTracker;
            this.searchQuery  = new this.SearchQuery(issueTracker);
            this.el           = createDiv({ cls: "issues__searchBar" });
        }

        render(containerEl) {
            this.searchQuery.render(this.el);

            this.newIssueBtn = this.el.createEl("button", { text: "New Issue" });
            this.newIssueBtn.onclick = () => {
                new this.issueTracker
                    .CreateIssueModal(this.issueTracker)
                    .open();
            }
            this.newIssueBtn.updateState = () => {
                // Disable the button if issue folder doesn't exist
                if (existsFolder(this.issueTracker.config.issues.folder_path)) {
                    this.newIssueBtn.disabled = false;
                    this.newIssueBtn.removeClass("mod-disabled");
                } else {
                    this.newIssueBtn.disabled = true;
                    this.newIssueBtn.addClass("mod-disabled");
                }
            }
            this.newIssueBtn.updateState();

            containerEl.appendChild(this.el);
        }

        SearchQuery = class {
            constructor(issueTracker) {
                this.issueTracker = issueTracker;

                this.input = createEl("input", {
                    attr: { placeholder: "Search issues" }
                });

                this.input.onkeydown = (event) => {
                    if (event.key == "Enter") {
                        this.submit();
                    }
                }

                this.setValue(issueTracker.config.issueTracker.default_query);
                this.submit();
            }

            setValue(value) {
                this.input.value = value;
            }

            submit() {
                this.parseQuery();
                this.issueTracker.filter.submitQuery(this.query);
            }

            parseQuery() {
                this.query = {
                    status:  undefined,
                    labels:  [],
                    title:   [],
                    content: [],
                };

                // Split queries by space, respects enclosed quotation marks
                let queries = this.input.value.match(/((\S+)?"[^"]+")|[\S]+/g)
                            || [];

                for (const query of queries) {
                    let [ query_type, query_content ]
                        = query.match(/^(status|is|title|label):(.+)$/)?.slice(-2)
                        || [];

                    if (!query_content) {
                        query_type = "content";
                        query_content = query;
                    }
                    query_content = query_content.replaceAll('"', '');

                    switch (query_type) {
                        case "status":
                        case "is":
                            if (!this.query.status) {
                                this.query.status = query_content;
                            }
                            break;
                        case "label":
                            this.query.labels.push(query_content);
                            break;
                        case "title":
                            this.query.title.push(query_content);
                            break;
                        case "content":
                            this.query.content.push(query_content);
                    }
                }
            }

            render(containerEl) {
                containerEl.appendChild(this.input);
            }
        }
    }

    IssueList = class {
        constructor(issueTracker) {
            this.issueTracker = issueTracker;
            this.issueFolder  = issueTracker.config.issues.folder_path;
            this.issues       = dv.pages(`"${this.issueFolder}"`)
                                  .map(page => new this.Issue(page));

            this.toolbar      = new this.ToolBar(issueTracker);

            this.el       = createDiv({ cls: "issueList" });
            this.issuesEl = createDiv();
        }

        async render(containerEl) {
            containerEl.appendChild(this.el);
            this.toolbar.render(this.el);
            this.el.appendChild(this.issuesEl);
        }

        async refresh() {
            this.toolbar.refresh();

            this.issuesEl.empty();
            if (this.issues.length == 0) {
                if (!existsFolder(this.issueFolder)) {
                    this.noIssuesMessage.noFolder(this.issuesEl);
                } else {
                    this.noIssuesMessage.noIssues(this.issuesEl);
                }
            }
            for (const issue of await this.issueTracker.filter.filterIssues(this.issues)) {
                issue.render(this.issuesEl);
            }
            if (this.issuesEl.children.length == 0) {
                this.noIssuesMessage.noMatch(this.issuesEl);
            }
        }

        // Messages to display when no issues are available for display
        noIssuesMessage = {
            noFolder: (containerEl) => {
                let contentEl = containerEl.createDiv({ cls: "no-issues-message" });
                contentEl.appendChild(getIcon.open());
                contentEl.appendChild(createEl('h3', { text: "Getting started" }));
                
                let msgEl = contentEl.createDiv();
                let createFolderBtn = msgEl
                    .createEl('button', { text: "Create Folder" });
                msgEl.appendChild(new Text(" at "));
                msgEl.createEl('code', { text: this.issueFolder });
                msgEl.appendChild(new Text(
                    ", or specify your preferred subfolder for issue notes:"
                ));
                msgEl.createEl('pre').createEl('code', {
                    text: "dv.view(\"path/to/IssueTracker\", {\n"
                        + "    obsidian: obisidian,\n"
                        + "    issue_folder: \"your/subfolder/\",\n"
                        + "});"
                });

                // Create folder, enable "New Issue" button, refresh issueList
                createFolderBtn.onclick = async () => {
                    await createFolder(this.issueFolder);
                    this.refresh();
                    this.issueTracker.searchBar.newIssueBtn.updateState();
                };
            },
            noIssues: (containerEl) => {
                let contentEl = containerEl.createDiv({ cls: "no-issues-message" });
                contentEl.appendChild(getIcon.closed());
                contentEl.appendChild(createEl('h3', { text: "A fresh start!" }));
                let msgEl = contentEl.createDiv();
                msgEl.appendChild(new Text("There are currently no issues."));
            },
            noMatch: (containerEl) => {
                let contentEl = containerEl.createDiv({ cls: "no-issues-message" });
                contentEl.appendChild(createEl('h3', { text: "No matches found" }));
            },
        }

        ToolBar = class {
            constructor(issueTracker) {
                this.issueTracker = issueTracker;
                this.statusOpenBtn
                    = new this.StatusBtn(this.issueTracker, "open", getIcon.open());
                this.statusClosedBtn
                    = new this.StatusBtn(this.issueTracker, "closed", getIcon.closed());
            }

            render(containerEl) {
                this.el = containerEl.createDiv({ cls: "issues__issueList__toolbar" });
                this.el.appendChild(this.statusOpenBtn.el);
                this.el.appendChild(this.statusClosedBtn.el);
            }

            refresh() {
                this.statusOpenBtn.refresh();
                this.statusClosedBtn.refresh();
            }

            StatusBtn = class {
                constructor(issueTracker, status, icon) {
                    this.issueTracker = issueTracker;
                    this.status = status;

                    // Capitalize first letter
                    let label = status.charAt(0).toUpperCase() + status.slice(1);

                    this.el = createSpan({ cls: "status-toggle" });
                    this.el.appendChild(icon);
                    this.el.appendChild(new Text(" "));
                    this.countText = this.el.appendChild(new Text(""));
                    this.el.appendChild(new Text(` ${label}`));
                }

                async refresh() {
                    this.countText.nodeValue = await this.issueTracker.filter
                        .getStatusCount(this.status);
                }
            }
        }

        Issue = class {
            constructor(dataview_page) {
                this.dv_file  = dataview_page.file;
                this.file     = getFile(this.dv_file.path);
                this.issueNo  = dataview_page.issueNo;
                this.status   = dataview_page.status;
                this.name     = dataview_page.file.name;
                this.labels   = dataview_page.labels || [];
                this.ctime    = dataview_page.file.ctime;
                this.mtime    = dataview_page.file.mtime;

                if (!Array.isArray(this.labels)) {
                    this.labels = this.labels.split(' ');
                }
            }

            render(containerEl) {
                this.el = containerEl.createDiv({ cls: "issue" });

                let issusStatusEl = this.el.createDiv({
                    cls: "issue-status",
                });
                issusStatusEl.appendChild(
                    this.status == "open"   ? getIcon.open() :
                    this.status == "closed" ? getIcon.closed() :
                    createDiv({ text: "?" })
                );

                let issueBodyEl = this.el.createDiv({ cls: "issue-body" });
                issueBodyEl.createEl("a", {
                    cls: "internal-link issue-clickable",
                    attr: { href: this.name, target: "_blank", rel: "noopener" },
                    text: this.name,
                });
                for (const label of this.labels) {
                    issueBodyEl.appendChild(new Text(" "));
                    issueBodyEl.createSpan({
                        cls: "label-chip",
                        attr: {label: label},
                        text: label,
                    })
                }
                issueBodyEl.createDiv({
                    cls: "issue-desc",
                    text: `#${this.issueNo} opened on ${this.ctime
                        .toFormat('y/MM/dd, hh:mm a')}`,
                })
            }
        }
    }

    CreateIssueModal = class extends obsidian.Modal {
        constructor(issueTracker) {
            super(app);
            this.issueTracker = issueTracker;

            this.containerEl.addClass("issueTracker__createIssue");
        }

        onOpen() {
            this.contentEl.createEl('h4', {
                text: `Issue: ${this.issueTracker.config.project.name}`
            });
            this.titleInput = this.contentEl.createEl('input', {
                cls: "title-setting",
                attr: { type: "text", placeholder: "Title" }
            });
            this.titleInput.tooltip = new Tooltip(this.titleInput, true);
            new obsidian.Setting(this.contentEl)
                .setClass("label-setting")
                .setName("Add labels")
                .addText((labelInput) => {
                    this.labelInput = labelInput.inputEl;
                    labelInput.inputEl.placeholder
                        = "Space delimitered labels, use \" \" to preserve space \"like this\"";
                })
            new obsidian.Setting(this.contentEl)
                .addButton((submitBtn) => {
                    submitBtn
                        .setButtonText("Create Issue")
                        .setCta()
                        .onClick(() => { this.submit() })
                })
        }

        onClose() {
            this.titleInput.tooltip.hide();
            this.contentEl.empty();
        }

        async submit() {
            let newIssueInfo = {
                issueNo: this.issueTracker.issueList.issues.length + 1,
                title:   this.titleInput.value,
                path:    resolvePath(this.issueTracker.config.issues.folder_path,
                                     this.titleInput.value + '.md'),

                // Split labels by space, respects enclosed quotations marks
                labels:  this.labelInput.value?.match(/"[^"]+"|([^"\s]+)/g)
                             ?.map(label => label.replaceAll('"', '')),
                issueTrackerConfig: this.issueTracker.config,
            }

            // Handle invalid issue titles
            if (!newIssueInfo.title) {
                this.titleInput.tooltip.show(
                    "Issue title cannot be empty"
                );
                return;
            } else if (!isValidFilename(newIssueInfo.title)) {
                this.titleInput.tooltip.show(
                    "Issue title cannot contain any of the following characters:\n"
                    + specialCharSet
                );
                return;
            } else if (this.issueTracker.issueList.issues.name
                .includes(newIssueInfo.title)) {
                this.titleInput.tooltip.show(
                    `Issue already exists`
                );
                return;
            }

            // Export new issue into to global for templater to pick up
            new IssueInfoExporter(newIssueInfo);

            // Create issue from template
            let issueFile = await templater.createNewFileFromTemplate(
                    newIssueInfo.path,
                    this.issueTracker.config.issues.template_name
                );
            
            openFile(issueFile, "new-tab");

            this.close();
        }
    }
}

/**
 * Export info of new issue onto global for templater to pickup
 */
class IssueInfoExporter {
    constructor(newIssueInfo) {
        this.issueNo            = newIssueInfo.issueNo;
        this.title              = newIssueInfo.title;
        this.labels             = newIssueInfo.labels || [];
        this.issueTrackerConfig = newIssueInfo.issueTrackerConfig;

        // Mount itself to window
        if (window.newIssueInfo) { clearTimeout(window.newIssueInfo.timeoutID); }
        window.newIssueInfo = this;

        // Remove itself after templater probably has finished parsing
        this.timeoutID = setTimeout(() => {
            delete window.newIssueInfo;
        }, 2000);
    }

    get labelsYAML() {
        let labelYAML = "";
        for (const label of this.labels) {
            labelYAML += `\n  - ${label}`;
        }
        return labelYAML;
    }

    /**
     * Both `issueTrackerLink()` and `projectNoteLink()` returns a Dataview Link
     * object, which offers various methods to mutate the link, see:
     * 
     * https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/data-model/value.ts#L416
     */
    get issueTrackerLink() { return this.issueTrackerConfig.issueTracker.link; }
    get projectNoteLink()  { return this.issueTrackerConfig.project.link; }
}

new IssueTracker(options).render(containerEl);
