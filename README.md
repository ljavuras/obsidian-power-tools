# Obsidian Periodic Notes - Navigation Template

Navigate between **daily**, **weekly**, **monthly**, **quarterly**, and **yearly** notes effortlessly.

![Navigation example](assets/navigation%20example.gif)

Mess around and make it yours!

## Required Plugins

Install them from _Community plugins_ tab within Obsidian.

- [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes)
- [Templater](https://github.com/SilentVoid13/Templater)

## Usage

### Setup
Copy the files in `template/` to your vault, and configure _Periodic Note_'s settings to use those templates.

Or you can copy the contents to your existing templates.

### Using the template
Creating notes with [Calendar plugin](https://github.com/liamcain/obsidian-calendar-plugin), or _Perodic Notes_' commands will insert the template automatically:

```
Periodic Notes: Open daily note
Periodic Notes: Open weekly note
Periodic Notes: Open yearly note
Periodic Notes: Open monthly note
Periodic Notes: Open quarterly note
```

### Customize
The template uses default filenames formats:

| Note      | Filename format |
|-----------|-----------------|
| Daily     | YYYY-MM-DD      |
| Weekly    | gggg-[W]ww      |
| Monthly   | YYYY-MM         |
| Quarterly | YYYY-[Q]Q       |
| Yearly    | YYYY            |

If you use customized filename formats, modify the template accordingly.

### Pitfalls
The template will not work if a periodic note is created by clicking links to a non-existing periodic note. You will get a empty note with a correct periodic title in `Default location for new notes` rather than `Note folder` set in _Periodic Notes_.

To fix this, manually move the note to the preferred location, and insert the tempelate manually with _Templater_.
