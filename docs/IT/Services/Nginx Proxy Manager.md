### 🚀 Installation de NPM sur un conteneur Alpine

```bash
apk update
apk upgrade
apk add docker-compose
```

```bash
mkdir ~/nginx-proxy-manager && cd ~/nginx-proxy-manager
```

On crée ensuite le fichier Docker-compose.yml :

```yml
services:
  app:
    image: 'docker.io/jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

```bash
mkdir -p data/nginx/{client_body_temp,proxy_temp,fastcgi_temp}
sudo chown -R 1000:1000 data/nginx
mkdir -p letsencrypt
sudo chown -R 1000:1000 letsencrypt
```

```bash
docker-compose up -d
```

On va sur http://$ip:81

Les credentials par défaut sont : 

```
Email:    admin@example.com
Password: changeme
```

