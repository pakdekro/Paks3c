### Fonctionnalités de Microsoft Entra Connect

- **Synchronisation du hachage du mot de passe** – méthode de connexion qui synchronise le hachage du mot de passe AD sur site d'un utilisateur avec Microsoft Entra ID.
- **Authentification directe :** méthode d’authentification qui permet aux utilisateurs d’utiliser le même mot de passe localement et dans le cloud, mais sans nécessiter l’infrastructure supplémentaire d’un environnement fédéré.
- **Intégration de fédération :** la fédération est une partie facultative de Microsoft Entra Connect qui peut servir à configurer un environnement hybride à l’aide d’une infrastructure AD FS locale. Elle offre également des fonctionnalités de gestion AD FS telles que le renouvellement de certificat et les déploiements de serveurs AD FS supplémentaires.
- **Synchronisation :** ce composant est chargé de créer des utilisateurs, des groupes et d’autres objets, et également de s’assurer que les informations d’identité relatives aux utilisateurs et aux groupes dans votre environnement local correspondent à celles qui se trouvent dans le cloud. Cette synchronisation inclut également des hachages de mot de passe.
- **Monitoring de l’intégrité :** Microsoft Entra Connect Health peut assurer une supervision robuste et offrir un emplacement central dans le centre d’administration Microsoft Entra pour la visualisation de cette activité.

---
### Avantages clés et bonnes pratiques :

| **Principaux avantages**                                                   | **Meilleures pratiques**                                                                                                                           |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sécurité améliorée                                                         | Tendances de verrouillage extranetRapport sur les échecs de connexionsConformité aux réglementations en matière de confidentialité                 |
| Obtention d’alertes pour tous les problèmes critiques liés au système ADFS | Configuration et disponibilité de serveur  <br>  <br>Performances et connectivité – Maintenance régulière                                          |
| Facilité de déploiement et de gestion                                      | Installation rapide de l’agentMise à niveau automatique de l’agent vers la dernière versionDonnées disponibles dans le portail en quelques minutes |
| Métriques d’utilisation enrichies                                          | Utilisation des principales applications  <br>Emplacements réseau et connexion TCP  <br>Demandes de jetons par serveur                             |
| Une meilleure expérience utilisateur                                       | Mode de tableau de bord à partir du centre d’administration Microsoft Entra  <br>  <br>Alertes par e-mail                                          |

---
### Comparaison entre Microsoft Entra Connect et la synchronisation cloud

Le tableau suivant permet de comparer Microsoft Entra Connect et Synchronisation cloud Microsoft Entra :

| **Fonctionnalité**                                                                           | **Connect sync** | **Synchronisation cloud**                                                           |
| -------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| Connexion à une forêt AD locale                                                              | ●                | ●                                                                                   |
| Connexion à plusieurs forêts AD locales                                                      | ●                | ●                                                                                   |
| Connexion à plusieurs forêts Active Directory locales déconnectées                           |                  | ●                                                                                   |
| Modèle d’installation d’agent léger                                                          |                  | ●                                                                                   |
| Plusieurs agents actifs pour la haute disponibilité                                          |                  | ●                                                                                   |
| Connexion aux annuaires LDAP                                                                 | ●                |                                                                                     |
| Prise en charge des objets utilisateur                                                       | ●                | ●                                                                                   |
| Prise en charge des objets groupe                                                            | ●                | ●                                                                                   |
| Prise en charge des objets contact                                                           | ●                | ●                                                                                   |
| Prise en charge des objets appareil                                                          | ●                |                                                                                     |
| Autorisation de la personnalisation de base pour les flux d’attributs                        | ●                | ●                                                                                   |
| Synchronisation des attributs Exchange Online                                                | ●                | ●                                                                                   |
| Synchronisation des attributs d’extension 1-15                                               | ●                | ●                                                                                   |
| Synchronisation des attributs Active Directory définis par le client (extensions d’annuaire) | ●                | ●                                                                                   |
| Prise en charge de la synchronisation de hachage de mot de passe                             | ●                | ●                                                                                   |
| Prise en charge de l’authentification directe                                                | ●                |                                                                                     |
| Prise en charge de la fédération                                                             | ●                | ●                                                                                   |
| Authentification unique transparente                                                         | ●                | ●                                                                                   |
| Installation des supports sur un contrôleur de domaine                                       | ●                | ●                                                                                   |
| Prise en charge pour Windows Server 2016                                                     | ●                | ●                                                                                   |
| Filtrage sur les domaines/unités d’organisation/groupes                                      | ●                | ●                                                                                   |
| Filtrage sur les valeurs d’attributs des objets                                              | ●                |                                                                                     |
| Autorisation d’un ensemble minimal d’attributs à synchroniser (MinSync)                      | ●                | ●                                                                                   |
| Autoriser la suppression des attributs du flux d'AD vers Microsoft Entra ID                  | ●                | ●                                                                                   |
| Autorisation de la personnalisation avancée pour les flux d’attributs                        | ●                |                                                                                     |
| Prise en charge de la réécriture du mot de passe                                             | ●                | ●                                                                                   |
| Prise en charge de la réécriture d’appareil                                                  | ●                | Les clients doivent utiliser l’approbation Kerberos cloud pour cette fonctionnalité |
| Prise en charge de la réécriture de groupe                                                   | ●                | ●                                                                                   |
| Prise en charge de la fusion des attributs utilisateur de plusieurs domaines                 | ●                |                                                                                     |
| Prise en charge de Microsoft Entra Domain Services                                           | ●                |                                                                                     |
| Écriture différée d’Exchange hybride                                                         | ●                | ●                                                                                   |
| Nombre illimité d’objets par domaine AD                                                      | ●                |                                                                                     |
| Prise en charge d’un maximum de 150 000 objets par domaine AD                                | ●                | ●                                                                                   |
| Groupes jusqu’à 50 000 membres                                                               | ●                | ●                                                                                   |
| Grands groupes jusqu’à 250 000 membres                                                       | ●                |                                                                                     |
| Références entre les domaines                                                                | ●                | ●                                                                                   |
| Approvisionnement à la demande                                                               |                  | ●                                                                                   |
| Prise en charge pour le gouvernement des États-Unis                                          | ●                | ●                                                                                   |