# Credential access
### DCSync

```spl
index="wineventlog" sourcetype="wineventlog:security" EventCode=4662 Object_Server="DS"
Properties="*1131f6aa-9c07-11d1-f79f-00c04fc2dcd2*" OR Properties="*1131f6ad-9c07-11d1-f79f-00c04fc2dcd2*" OR Properties="*89e95b76-418e-11d1-a9c0-0000f80367c1*"
Account_Name!="*$"
| stats count by Account_Name, Subject_Domain_Name, Object_Name
| rename Account_Name as Source_Account, Subject_Domain_Name as Source_Domain, Object_Name as Domain_Controller
| sort -count
```

### Kerberoasting

```spl
index="wineventlog" sourcetype="wineventlog:security" EventCode=4769 Service_Name!="*$" Ticket_Encryption_Type="0x17"
| stats count by Client_Address, Service_Name, Account_Name
| sort -count
| rename Client_Address as Attacker_IP, Service_Name as Target_Service_Account, Account_Name as Requesting_User

```

### Accès suspects au processus lsass

```spl
index="sysmon" sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventID=10 TargetImage="C:\\Windows\\system32\\lsass.exe"
(GrantedAccess="0x1010" OR GrantedAccess="0x1410" OR GrantedAccess="0x1000" OR GrantedAccess="0x1400" OR GrantedAccess="0x1018" OR GrantedAccess="0x1038" OR GrantedAccess="0x1418" OR GrantedAccess="0x1438" OR GrantedAccess="0x1F0FFF" OR GrantedAccess="0x1F1FFF" OR GrantedAccess="0x1F2FFF" OR GrantedAccess="0x1F3FFF")
SourceImage!="C:\\Windows\\system32\\svchost.exe"
| stats count by SourceImage, TargetImage, GrantedAccess, CallTrace
| sort -count
```

## Defense evasion

### Injection de processus

```spl
index="sysmon" sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventID=8
| search NOT (SourceImage IN ("C:\\Windows\\system32\\svchost.exe", "C:\\Windows\\system32\\csrss.exe", "C:\\Windows\\System32\\RuntimeBroker.exe") AND TargetImage IN ("C:\\Windows\\system32\\svchost.exe", "C:\\Windows\\system32\\csrss.exe", "C:\\Windows\\System32\\RuntimeBroker.exe"))
| stats count by SourceImage, TargetImage, StartAddress, StartModule
| sort -count

```

### Commandes powershell suspectes

```spl
index="sysmon" sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational" EventID=1 Image IN ("*\\powershell.exe", "*\\pwsh.exe")
(CommandLine="*EncodedCommand*" OR CommandLine="*enc*" OR CommandLine="*IEX*" OR CommandLine="*Invoke-Expression*" OR CommandLine="*DownloadString*" OR CommandLine="*http://*" OR CommandLine="*https://*")
| stats count by ParentImage, Image, CommandLine, User
| sort -count
```

