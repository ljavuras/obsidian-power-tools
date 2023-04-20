# Filename Template

Insert template based on filename of a new note, and also centralizes template settings into one script, making it easier to manage your templates accross various plugins.

![Filename Template Demo](assets/demo.gif)

Filename templates can help you automatically populate the correct templates for daily or periodic notes that links to a future date that is yet non-existing.

## Requirement

### Plugins

- [Templater](https://github.com/SilentVoid13/Templater)

## How to Use

1. Copy `main.md` to your vault's Templater template folder location.
2. Modify `noteTypes` in `main.md` to configure template settings:
    1. `format`: file name in [momentjs format](https://momentjs.com/docs/#/displaying/format/).
    2. `template`: template for file whose name matches `format`.

### Set as Default Template

Ever changed location of you template files, and have to change 5+ template settings? Not anymore.

1. Goto _Templater_ settings and find _Folder Templates_
2. Toggle _Enable Folder Templates_, and click _Add New_
3. Set _Folder_ to `/`, and _Template_ to `main.md`

`main.md` will be triggered when a new **empty** folder is created, and `main.md` will insert the appropriate template for the filename.

## Applications

If you need to use a specific template for a complex file path, such as `Project/yourProject/yourProject.md`, you can customize the code to detect it. This is not possible with the built-in Folder Templates feature of Templater.