# qseditor

BBS post editor, markdown/bbcode supported.

## Demo

[https://stevearzh.github.io/qseditor](https://stevearzh.github.io/qseditor)

## Author

* [quininer](https://github.com/quininer)
* [Stevearzh](https://github.com/Stevearzh)

## Markdown

Markdown-mode is the default mode, but you can easily switch to bbcode-mode by click the switch tag on the top-left corner of editor.

If you want to know more about markdown syntax, click [here](http://markdown.tw).

![](/img/markdown-input.png)

![](/img/markdown-preview.png)


## BBCode

BBCode syntax see [here](https://bbs.archlinuxcn.org/help.php#bbcode).

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

at the bottom of ```<body>``` element.

Finally, add

```html
<div id="qse"></div>
```

to where you want the editor appear.

## Config

Open ```qse.min.js```(or ```qse.js```, then minimize the script yourself after modification), change ```formDataURL```, ```Bucket``` and ```API``` to your own value. 

```javascript
formDataURL: '/post.php';   // Post URL
Bucket: 'qseditor';   // Your UPCloud bucket name
API: 'hXTO2xagYw98S646UEyRh7BJ+DM=';   // Your bucket API
```

**Notice: Only UPCloud is supported!**

## Others

Also, we use these libraries in our project:

* [JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5)
* [js-base64](https://github.com/dankogai/js-base64)
* [md2bbc](https://github.com/alfateam123/md2bbc)
* [bbcode](https://github.com/kaimallea/bbcode)
