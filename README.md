# qseditor

BBS post editor, markdown/bbcode support.

## demo

[https://stevearzh.github.io/qseditor](https://stevearzh.github.io/qseditor)

## Markdown Mode

![](/img/markdown-input.png)

![](/img/markdown-preview.png)


## BBCode Mode

![](/img/bbcode-input.png)

![](/img/bbcode-preview.png)

## Usage

First, add

```html
<link rel="stylesheet" href="<path>/build/qse.min.css">
```

in ```<head>``` tag.

Then, add

```html
<script src="<path>/build/JavaScript-MD5/md5.min.js"></script>
<script src="<path>/build/js-base64/base64.min.js"></script>
<script src="<path>/build/md2bbc/showdown.min.js"></script>
<script src="<path>/build/md2bbc/mkd.js"></script>
<script src="<path>/build/bbcode/bbcode.js"></script>
<script src="<path>/build/qse.min.js"></script>
```

at the bottom of body element.

Finally, add

```html
<div id="qse"></div>
```

to where you want the editor appear.

## Config

Open ```qse.min.js```, change ```formDataURL```, ```Bucket``` and ```API``` to your own value. **Only UPCloud supported!**