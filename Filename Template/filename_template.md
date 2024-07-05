<%*
let templater      = app.plugins.plugins["templater-obsidian"];
let templateFolder = templater.settings.templates_folder;

/**
 * format:   momentjs format strings for filename
 * template: name of template
 * 
 * If the file name matches the format, respective
 * template will be inserted.
 */
let noteTypes = [
    {format: "YYYY-MM-DD",     template: "daily.md"},
    {format: "gggg-[W]ww",     template: "weekly.md"},
    {format: "YYYY-MMDD-HHmm", template: "unique-note.md"},
    // ...etc
];

for (const noteType of noteTypes) {

    // If found a matching note title
    if (moment(tp.file.title,
               noteType.format,
               true)
        .isValid()) {

        // Get TFile of template
        let templateTFile;
        try {
            // Get TFile
            templateTFile = app.vault.getAbstractFileByPath(
                `${templateFolder}/${noteType.template}`
            );

            // Error handling
            if (!templateTFile) {
                let msg = "Template not found\n" +
                          `${templateFolder}/${noteType.template} does not exist.`;
                new Notice(msg);
                throw Error(msg);
            }
        } catch (e) {
            console.error(e);
            return;
        }

        // Insert template
        templater.templater.append_template_to_active_file(
            templateTFile
        );
    }
}

for (const noteType of noteTypes) {
    if (moment(tp.file.title,
               noteType.format,
               true).isValid()) {
        let templateTFile = app.vault.getAbstractFileByPath(
            `${templateFolder}/${noteType.template}`
        );

        templater.templater.append_template_to_active_file(
            templateTFile
        );
    }
}
-%>