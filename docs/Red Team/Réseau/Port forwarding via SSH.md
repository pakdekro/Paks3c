Port forwarding local (le port distant 3306 sera accessible via le port local 1234):

```shell-session
ssh -L 1234:localhost:3306 Ubuntu@10.129.202.64
```

Multiple port forwarding local:

```shell-session
ssh -L 1234:localhost:3306 8080:localhost:80 ubuntu@10.129.202.64
```
