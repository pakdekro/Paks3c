## 📝 Opérateurs de base

### **site:**

```
site:example.com
site:*.example.com
site:example.com -www
```

### **filetype: / ext:**

```
filetype:pdf
filetype:xls
filetype:doc
filetype:ppt
filetype:sql
filetype:log
filetype:bak
filetype:old
ext:php
ext:asp
ext:jsp
```

### **intitle:**

```
intitle:"index of"
intitle:"admin panel"
intitle:"login"
intitle:"dashboard"
intitle:"phpMyAdmin"
intitle:"configuration"
```

### **inurl:**

```
inurl:admin
inurl:login
inurl:config
inurl:backup
inurl:test
inurl:dev
inurl:staging
```

### **intext:**

```
intext:"password"
intext:"username"
intext:"error"
intext:"warning"
intext:"mysql_connect"
```

### **allintitle:**

```
allintitle:admin panel login
allintitle:index of private
```

### **allinurl:**

```
allinurl:admin login panel
```

### **allintext:**

```
allintext:username password email
```

---

## 🔍 Recherche de fichiers sensibles

### **Fichiers de configuration**

```
filetype:env "DB_PASSWORD"
filetype:conf "password"
filetype:config "database"
filetype:ini "password"
filetype:cfg "password"
filetype:xml "password"
filetype:properties "password"
```

### **Fichiers de sauvegarde**

```
filetype:bak
filetype:old
filetype:backup
filetype:tmp
site:example.com filetype:sql
site:example.com ext:sql
```

### **Logs d'erreur**

```
filetype:log
filetype:err
"error log" filetype:txt
"access denied" filetype:log
intitle:"index of" "error.log"
```

### **Fichiers de dump**

```
filetype:sql "INSERT INTO"
filetype:sql "CREATE TABLE"
filetype:dump
intitle:"index of" "database.sql"
```

---

## 🔐 Panels d'administration

### **Panels génériques**

```
intitle:"Admin Panel"
intitle:"Administration"
intitle:"Admin Login"
intitle:"Control Panel"
intitle:"Dashboard"
inurl:admin
inurl:administrator
inurl:wp-admin
```

### **Applications spécifiques**

```
intitle:"phpMyAdmin"
intitle:"Adminer"
intitle:"cPanel"
intitle:"Webmin"
intitle:"DirectAdmin"
intitle:"Plesk"
intitle:"Roundcube"
intitle:"SquirrelMail"
```

### **Pages de login**

```
inurl:login.php
inurl:signin.php
inurl:auth.php
inurl:admin.php
intitle:"User Login"
intitle:"Please login"
intitle:"Sign in"
```

---

## 🌐 Découverte de sous-domaines

### **Wildcards**

```
site:*.example.com
site:*.*.example.com
```

### **Sous-domaines communs**

```
site:admin.example.com
site:test.example.com
site:dev.example.com
site:staging.example.com
site:beta.example.com
site:mail.example.com
site:ftp.example.com
site:api.example.com
```

### **Combinaisons**

```
site:example.com inurl:admin
site:example.com intitle:test
site:example.com intitle:dev
```

---

## 📁 Directory listing

### **Index of**

```
intitle:"index of"
intitle:"index of" "parent directory"
intitle:"index of /" +passwd
intitle:"index of /" +password.txt
intitle:"index of /admin"
intitle:"index of /backup"
intitle:"index of /mail"
intitle:"index of /config"
```

### **Répertoires sensibles**

```
intitle:"index of" "/.ssh"
intitle:"index of" "/password"
intitle:"index of" "/backup"
intitle:"index of" "/config"
intitle:"index of" "/database"
intitle:"index of" "/uploads"
```

---

## 💻 Technologies spécifiques

### **PHP**

```
filetype:php "mysql_connect"
filetype:php "mysql_query"
inurl:config.php
"PHP Warning" filetype:txt
"PHP Error" filetype:log
```

### **ASP.NET**

```
filetype:aspx
"Server Error" "ASP.NET"
ext:config "connectionString"
```

### **JavaScript**

```
filetype:js "password"
filetype:js "api_key"
filetype:js "secret"
```

### **Python**

```
filetype:py "password"
filetype:py "SECRET_KEY"
```

---

## 🔑 Informations sensibles

### **Mots de passe**

```
filetype:txt "password"
filetype:xls "password"
"username" "password" filetype:xls
"login" "password" filetype:xls
intitle:"passwords" filetype:txt
```

### **Clés API**

```
"api_key" filetype:json
"secret_key" filetype:env
"aws_access_key_id"
"mongodb://"
"mysql://"
```

### **Emails**

```
"@gmail.com" filetype:xls
"@company.com" filetype:txt
filetype:xls "email"
```

### **Numéros de téléphone**

```
filetype:xls "phone"
filetype:csv "telephone"
```

---

## 🌍 Recherches par pays/langue

### **Sites par pays**

```
site:.fr
site:.de
site:.uk
site:.cn
site:.ru
site:.in
```

### **Sites gouvernementaux**

```
site:.gov
site:.mil
site:.edu
```

---

## 📄 Documents spécifiques

### **PDF sensibles**

```
filetype:pdf "confidential"
filetype:pdf "internal use"
filetype:pdf "not for distribution"
filetype:pdf site:example.com
```

### **Présentations**

```
filetype:ppt "confidential"
filetype:pptx "internal"
```

### **Tableurs**

```
filetype:xls "password"
filetype:xlsx "employee"
filetype:csv "username"
```

---

## 🔧 Applications web communes

### **WordPress**

```
inurl:wp-admin
inurl:wp-login
inurl:wp-config.php
"wp-config.php" backup
intitle:"WordPress"
```

### **Joomla**

```
inurl:administrator/index.php
"joomla" intitle:"Administration"
```

### **Drupal**

```
inurl:user/login
"drupal" intitle:"User account"
```

### **Magento**

```
inurl:admin/index/index
"magento" intitle:"Admin"
```

---

## 🎯 Recherches OSINT

### **Réseaux sociaux**

```
site:facebook.com "company name"
site:linkedin.com "company name"
site:twitter.com "company name"
site:instagram.com "company name"
```

### **Profils employés**

```
site:linkedin.com "works at company"
site:linkedin.com intitle:"company name"
```

### **Code repositories**

```
site:github.com "company name"
site:github.com "password"
site:pastebin.com "company name"
```

---

## ⚠️ Vulnérabilités communes

### **SQL Injection**

```
inurl:index.php?id=
inurl:page.php?id=
inurl:product.php?id=
"mysql_fetch_array()" "error"
"Warning: mysql_"
```

### **Directory traversal**

```
inurl:../
inurl:..%2F
"directory traversal"
```

### **LFI/RFI**

```
inurl:include.php?file=
inurl:page.php?file=
"Warning: include("
```

### **Erreurs communes**

```
"Fatal error" "Call to undefined function"
"Warning: Cannot modify header"
"mysql_connect()" "Access denied"
"ORA-00921: unexpected end of SQL command"
```

---

## 🎲 Combinaisons avancées

### **Operateurs logiques**

```
site:example.com AND filetype:pdf
site:example.com OR site:test.com
site:example.com -www
"admin panel" -demo -example
```

### **Wildcards et plages**

```
site:*.example.com
"admin" site:*.com
```

### **Recherches temporelles**

```
site:example.com after:2020
site:example.com before:2023
```

---

## 🛡️ Contournement et évasion

### **Éviter la détection**

```
Utiliser des VPN/proxies
Varier les requêtes
Ajouter du délai entre les requêtes
Utiliser différents user-agents
```

### **Operateurs alternatifs**

```
cache:example.com
related:example.com
info:example.com
```

---

## 📋 Dorks par secteur

### **Éducation**

```
site:edu filetype:xls "student"
site:edu "grade" filetype:xls
site:edu intitle:"student information"
```

### **Gouvernement**

```
site:gov filetype:pdf "classified"
site:gov "employee" filetype:xls
site:mil "personnel" filetype:pdf
```

### **Santé**

```
"patient" filetype:xls
"medical record" filetype:pdf
intitle:"patient information"
```

### **Finance**

```
"account number" filetype:xls
"credit card" filetype:xls
"bank account" filetype:csv
```

---

## 🔍 Outils et automation

### **Google Hacking Database**

- exploit-db.com/google-hacking-database
- Dorks pré-construits par catégorie

### **Outils automatisés**

```bash
# GooFuzz
goofuzz -t example.com

# Pagodo
pagodo -d example.com -g dorks.txt

# GoogD0rker
python3 GoogD0rker.py -d example.com
```

### **Extensions navigateur**

- Google Dorking extension
- DorkSearch
- OSINT Browser Extension

---

## 💡 Tips et bonnes pratiques

### **Stratégie progressive**

1. Commencer large avec site:target.com
2. Affiner avec filetype: et intitle:
3. Combiner plusieurs opérateurs
4. Vérifier les résultats manuellement

### **Éthique et légal**

- Respecter les robots.txt
- Ne pas surcharger les serveurs
- Signaler les vulnérabilités de manière responsable
- Respecter les lois locales sur la cybersécurité

### **Limitations**

- Google limite les résultats à ~1000 par recherche
- Certains résultats peuvent être filtrés
- Les résultats changent constamment
- Utiliser d'autres moteurs (Bing, DuckDuckGo) pour comparaison