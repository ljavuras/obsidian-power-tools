# Obsidian Periodic Notes - Navigation Template

Navigate between **daily**, **weekly**, **monthly**, **quarterly**, and **yearly** notes effortlessly in [Obsidian](https://obsidian.md/).

![Navigation example](assets/navigation%20example.gif)

Mess around and make it yours!

## About

There are two sets of templates:

| Template           | Description                                                |
|--------------------|------------------------------------------------------------|
| `template/`        | Includes additional features                               |
| `template-simple/` | Includes only the barebone, easier to read and tinker with |

### Additional features provided by `template/`
- Remove duplicated links in month-crossing-weeks, credits to [@PhyberApex](https://github.com/PhyberApex)
- Customize filename format (planned)
- Customize link display text (planned)

## Prerequisites

### Plugins

Install plugins from _Community plugins_ tab within Obsidian.

- [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes)
- [Templater](https://github.com/SilentVoid13/Templater)
- [Calendar plugin](https://github.com/liamcain/obsidian-calendar-plugin) (optional)

### Settings

Enable `Trigger Templater on new file creation` setting for Templater.

## Usage

### Setup
Copy the templates in `template/` or `template-simple/` to your vault, and configure _Periodic Note_'s settings to use those templates.

Alternatively, you can copy the contents to your existing templates.

### Using the template
Insert template automatically by clicking on the calender provided by _Calendar plugin_, or run _Periodic Notes_' command:

```
Periodic Notes: Open daily note
Periodic Notes: Open weekly note
Periodic Notes: Open yearly note
Periodic Notes: Open monthly note
Periodic Notes: Open quarterly note
```

### Customization
The template uses **default filenames formats** for periodic notes, if you are using customized filename formats, modify the template accordingly.

| Note      | Filename format |
|-----------|-----------------|
| Daily     | YYYY-MM-DD      |
| Weekly    | gggg-[W]ww      |
| Monthly   | YYYY-MM         |
| Quarterly | YYYY-[Q]Q       |
| Yearly    | YYYY            |

Refer to the [Templater documentation](https://silentvoid13.github.io/Templater/introduction.html) and [Moment.js documentation](https://momentjs.com/docs/) for further customization.

### Pitfalls
The template will not work if a periodic note is created by clicking links to a non-existing periodic note. You will get a empty note with a correct periodic title in `Default location for new notes` rather than `Note folder` set in _Periodic Notes_.

To fix this, manually move the note to the preferred location, and insert the tempelate manually with _Templater_.

### Permanent fix
Use _Templater_'s folder templates feature, combine with absolute paths in the template will fix it.