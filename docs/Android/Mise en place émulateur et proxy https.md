### Installation des outils

On installe adb :

```bash
sudo apt install adb
```

Comme émulateur, le plus simple est encore de passer par Android Studio via un flatpak : https://flathub.org/apps/com.google.AndroidStudio

---

### Création de l'AVD

![](../docs/Files/Pasted%20image%2020250611130250.png)

![](../docs/Files/Pasted%20image%2020250611130439.png)

Le plus générique est de prendre un modèle Pixel (ici le 3a) ainsi qu'un Android 12.0. Penser à sélectionner les services "Google APIs" => ils permettent d'être root, et les services de Google sont installables par la suite au besoin.

---

### Installation du certificat Burpsuite

Dans les options du Burpsuite, penser à configurer ceci :

```
# Proxy > Options > Add Listener 
# - Port: 8080 
# - Bind to address: All interfaces 
# - ✅ Support invisible proxying
```

Puis exporter le certificat de Burpsuite (qu'on nommera cacert.der).

Convertir ensuite le certificat :

```bash
openssl x509 -inform DER -in cacert.der -out burp_ca.pem 
HASH=$(openssl x509 -inform PEM -subject_hash_old -in burp_ca.pem | head -1) 
cp burp_ca.pem ${HASH}.0
```

Le certificat doit ensuite être copié dans un dossier system de notre android. Pour ce faire :

```bash
export ANDROID_AVD_HOME=~/.var/app/com.google.AndroidStudio/config/.android/avd

cd ~/Android/Sdk/emulator
./emulator -list-avds
# Pixel_3a
./emulator -avd Pixel_3a -writable-system -no-snapshot-load

adb root && adb remount
adb push ${HASH}.0 /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/${HASH}.0
adb reboot
```

Une fois fait, nous devons voir sur notre Android un nouveau certificat au nom de PortSwigger.

On définit ensuite le proxy global :

```bash
adb shell settings put global http_proxy $NotreIpLocale:8080
adb shell settings put global https_proxy $NotreIpLocale:8080
```


> [!Attention] Attention :) !
> Certaines applications peuvent avoir le droit de bypasser le proxy défini dans Android.

Dans ce cas, il peut être utile de définir une règle iptable directement :

```bash
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -j DNAT --to-destination $NotreIpLocale:8080"
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 80 -j DNAT --to-destination $NotreIpLocale:8080"
```

