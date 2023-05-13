# Filename Template

A template that inserts another template based on file name.

Centralizes template settings across different plugins into one script, useful if you are using Templater, Periodic Notes, Unique note creator...etc, all at the same time.

![Filename Template Demo](assets/demo.gif)

Filename template can populate the correct template for daily/periodic notes, **even if the note is created by clicking links**.

## Requirement

### Plugins

- [Templater](https://github.com/SilentVoid13/Templater)

## How to use

1. Copy `filename_template.md` to your Templater template folder location.
2. Modify `noteTypes` in `filename_template.md` to configure template settings:
    1. `format`: file name in [momentjs format](https://momentjs.com/docs/#/displaying/format/).
    2. `template`: template for file whose name matches `format`.

### Set as Default Template

1. Goto _Templater_ settings and find _Folder Templates_
2. Toggle _Enable Folder Templates_, then click _Add New_
3. Set _Folder_ to `/`, and _Template_ to `filename_template.md`

`filename_template.md` will now be triggered whenever a new **empty note** is created, it will match note name with the format you specify, and insert the associated template.

## You can also...

- Call `tp.file.move()` in your template, and the new note will move to its designated location.
- Match complex file path, such as `Project/YourProject/YourProject.md`, which is not possible with the built-in Templater features.