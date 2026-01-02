Globalement, wifite va tenter toutes les attaques de base possibles sur un réseau wifi:

En cas de WEP:
- Attaque récupérant la clef WEP

En cas de WPA:
- Si il y a du WPS : Attaque "Pixi Dust" et bruteforce
- Tentative pour récupérer le PMKID et le cracker
- Tentative de deauth des différents clients pour récupérer le handshake et le cracker

```bash
wifite -i wlan0
```

