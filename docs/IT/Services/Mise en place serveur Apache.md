### Mise en place sécurisée d’un serveur Apache sur Debian

#### Installation d’Apache

Avant d’installer Apache, assurez-vous que votre système est à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

Puis installez Apache :

```bash
sudo apt install apache2 -y
```

Vérifiez que le service est bien démarré :

```bash
sudo systemctl status apache2
```

Activez Apache au démarrage :

```bash
sudo systemctl enable apache2
```

---

### Sécurisation de la configuration d’Apache

#### Désactiver les informations sensibles

Par défaut, Apache affiche sa version et d’autres informations qui pourraient être utilisées pour une attaque. Modifiez le fichier de configuration principal :

```bash
sudo nano /etc/apache2/conf-available/security.conf
```

Assurez-vous que les lignes suivantes sont bien présentes et décommentées :

```apache
ServerTokens Prod
ServerSignature Off
TraceEnable Off
FileETag None
```

Appliquez les modifications :

```bash
sudo systemctl restart apache2
```

#### Restreindre l’accès aux répertoires

Dans le fichier `/etc/apache2/apache2.conf`, localisez la section `<Directory />` et modifiez-la comme suit :

```apache
<Directory />
    Options None
    AllowOverride None
    Require all denied
</Directory>
```

Cela empêche l’accès aux répertoires système et réduit la surface d’attaque.

#### Activer les modules de sécurité

Activez les modules suivants pour renforcer la sécurité d’Apache :

```bash
sudo a2enmod headers rewrite ssl security2
```

Ajoutez des en-têtes de sécurité dans `/etc/apache2/conf-available/security.conf` :

```apache
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';"
```

Appliquez les changements :

```bash
sudo systemctl restart apache2
```

---

### Configuration HTTPS avec Let’s Encrypt

Installez Certbot et le module Apache correspondant :

```bash
sudo apt install certbot python3-certbot-apache -y
```

Générez un certificat SSL :

```bash
sudo certbot --apache
```

Suivez les instructions et assurez-vous que la redirection HTTP vers HTTPS est activée.  
Vérifiez l’automatisation du renouvellement :

```bash
sudo certbot renew --dry-run
```

Ajoutez un cron job pour renouveler automatiquement les certificats :

```bash
echo "0 3 * * * certbot renew --quiet" | sudo tee /etc/cron.d/certbot-renew
```

---

### Protection contre les attaques courantes

#### Protection contre les attaques DoS (mod_evasive)

Installez le module :

```bash
sudo apt install libapache2-mod-evasive -y
```

Éditez son fichier de configuration :

```bash
sudo nano /etc/apache2/mods-available/evasive.conf
```

Ajoutez les lignes suivantes :

```apache
DOSHashTableSize    2048
DOSPageCount        10
DOSSiteCount        50
DOSBlockingPeriod   600
DOSLogDir           "/var/log/mod_evasive"
```

Créez le répertoire des logs et donnez-lui les bonnes permissions :

```bash
sudo mkdir -p /var/log/mod_evasive
sudo chown -R www-data:www-data /var/log/mod_evasive
```

Redémarrez Apache :

```bash
sudo systemctl restart apache2
```

#### Protection contre les injections SQL et XSS (mod_security)

Installez ModSecurity :

```bash
sudo apt install libapache2-mod-security2 -y
```

Activez la règle Core Rule Set (CRS) :

```bash
sudo mv /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf
```

Activez ModSecurity :

```bash
sudo a2enmod security2
sudo systemctl restart apache2
```

---

### Journalisation et surveillance

#### Configurer la journalisation des accès et erreurs

Les logs d’Apache se trouvent par défaut dans :

- `/var/log/apache2/access.log` (journal des accès)
- `/var/log/apache2/error.log` (journal des erreurs)

Pour surveiller les tentatives suspectes, utilisez :

```bash
sudo tail -f /var/log/apache2/access.log
```

#### Installer Fail2Ban pour bloquer les IP malveillantes

Installez Fail2Ban :

```bash
sudo apt install fail2ban -y
```

Ajoutez un filtre Apache :

```bash
sudo nano /etc/fail2ban/jail.local
```

Ajoutez la configuration suivante :

```ini
[apache-auth]
enabled = true
port = http,https
logpath = /var/log/apache2/error.log
maxretry = 10
```

Activez Fail2Ban :

```bash
sudo systemctl restart fail2ban
```

Pour voir les IP bannies :

```bash
sudo fail2ban-client status apache-auth
```
