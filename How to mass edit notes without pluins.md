# How to mass edit notes without plugins

Open Developer Tools with `ctrl+shift+i`, and execute these code in console.

> [!CAUTION]
> **DO NOT** execute code you don't understand, backup or version control, such as git, are highly recommended.

> [!warning]
> Most of these operations will modily file creation time `ctime` to the time you execute the command

## Add property `created` to every note in the vault

> [!warning]
> This operation can ruin `created` property, if notes are synced via Syncthing, because Syncthing DO NOT preserve creation time `ctime` across devices.

```js:console
app.vault.getMarkdownFiles()  // Get all markdown files
    .filter((tfile) => !tfile.path.startsWith("System/"))  // Exclude notes
    .forEach((tfile) => {
        let ctime = moment(tfile.stat.ctime).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        app.fileManager.processFrontMatter(tfile, (fm) => {fm['created'] = ctime});
    });
```

Shared on Obsidian Forum:
[Mass edit properties without plugins - Share & showcase - Obsidian Forum](https://forum.obsidian.md/t/mass-edit-properties-without-plugins/83666)

## Set tags property for all markdown files whose name starts with `Issues - `
```js:console
app.vault.getMarkdownFiles()
    .filter((tfile) => tfile.name.startsWith("Issues - "))
    .forEach((tfile) => {
        app.fileManager.processFrontMatter(tfile, (fm) => { fm['tags'] = ['#is-a/dashboard/issue-tracker'] });
    });
```

## Add tags to all periodic notes
```js:console
app.vault.getMarkdownFiles()
    .filter((tfile) => tfile.path.startsWith("Periodic/"))
    .forEach(t => {
        customJS.Obsidian.frontmatter.addTags(t, [
            // #note/periodic/type
            'note/' + t.parent.path.toLowerCase(),
            'is/personal'
        ])
    })
```

## Cast `labels` property from string to list for notes with `#note/issue` tag
Parse a space dilimetered string into a list.
The following code solved this issue: [[Use correct YAML format]]
```js:console
DataviewAPI.pages("#note/issue")
    .filter(p => typeof p.labels === 'string')
    .forEach((p) => {
        customJS.Obsidian.frontmatter.set(
            customJS.Dataview.getFile(p),
            { labels: p.labels.split(' ') }
        )
    })
```

## Add `template-version` property to selected notes
```js:console
DataviewAPI.pages("#note/issue")
    .filter(p => {
        let project_name = p.file.folder.slice(8, -7);
        switch (project_name) {
            case "Outdated Project":
                return true;
            case "Outdated Project 2":
                return p.issueNo < 12;
            case "Outdated Project 3":
                return p.issueNo < 39;
            default:
                return false;
        }
    })
    .forEach((p) => {
        customJS.Obsidian.frontmatter.set(
            customJS.Dataview.getFile(p),
            { 'template-version': 1 }
        )
    })
DataviewAPI.pages("#note/issue")
    .filter(p => !p['template-version'])
    .forEach((p) => {
        customJS.Obsidian.frontmatter.set(
            customJS.Dataview.getFile(p),
            { 'template-version': 2 }
        )
    })
```

## Apply update template to outdated notes
```js:console
let issue_pages = DataviewAPI.pages()
    .filter(p => (p.template == "note.project.issue") && (p['template-version'] == 1))
for (let issue_page of issue_pages) {
    await customJS.Templater.apply(issue_page.file.path, "note.project.issue.update.1");
}
```

## Move notes with certain `#tag` into a folder
> [!warning]
> This code is not tested
```js:console
DataviewAPI.pages("#tag/to/move")
    .forEach(p => {
        app.vault.rename(
            app.vault.getAbstractFileByPath(p.file.path),
            "path/to/new/folder/" + p.file.name + ".md"
        )
    })
```
Shared on reddit: https://www.reddit.com/r/ObsidianMD/s/Zmh8TviQGq

## Mass rename properties
Rename property `convo-replies-to` to `convo/replies-to`
```js:console
DataviewAPI.pages()
    .filter(p => p['convo-replies-to'])
    .forEach((p) => {
        customJS.Obsidian.frontmatter.rename(
            customJS.Dataview.getFile(p),
            "convo-replies-to",
            "convo/replies-to"
            )
    })
```

## Set `note/version` property if note doesn't start with a heading
```js:console
DataviewAPI.pages('"Project"')
    .filter(p => p.file.path.includes("/notes/"))
    .filter(p => !p.file.name.startsWith("meeting."))
    .filter(p => app.metadataCache.getCache(p.file.path).sections[1].type != 'heading')
    .sort(p => p.file.ctime).forEach(p => {
        app.fileManager.processFrontMatter(
            customJS.Dataview.getFile(p),
            (frontmatter) => {
                frontmatter['template/version'] = 1;
            }
        )
    })
```