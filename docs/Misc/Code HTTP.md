
| **Code** | **Catégorie**    | **Signification**                                                                                         |
| -------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| 100      | Informationnelle | Continue : Le client peut continuer sa requête.                                                           |
| 101      | Informationnelle | Switching Protocols : Le serveur accepte de changer de protocole.                                         |
| 102      | Informationnelle | Processing : Le serveur traite la requête, mais aucune réponse n'est disponible.                          |
| 200      | Succès           | OK : La requête a réussi.                                                                                 |
| 201      | Succès           | Created : La ressource a été créée avec succès.                                                           |
| 202      | Succès           | Accepted : La requête a été acceptée mais n'est pas encore traitée.                                       |
| 203      | Succès           | Non-Authoritative Information : La réponse contient des informations non officielles.                     |
| 204      | Succès           | No Content : La requête a réussi, mais il n'y a pas de contenu à envoyer.                                 |
| 205      | Succès           | Reset Content : Le serveur indique de réinitialiser la vue du document.                                   |
| 206      | Succès           | Partial Content : Réponse partielle, souvent utilisée pour des téléchargements.                           |
| 300      | Redirection      | Multiple Choices : Plusieurs options pour la ressource demandée.                                          |
| 301      | Redirection      | Moved Permanently : La ressource a été déplacée de façon permanente.                                      |
| 302      | Redirection      | Found (Temporary Redirect) : La ressource a été temporairement déplacée.                                  |
| 303      | Redirection      | See Other : La réponse à la requête peut être trouvée à une autre URL.                                    |
| 304      | Redirection      | Not Modified : La ressource n'a pas été modifiée depuis la dernière requête.                              |
| 305      | Redirection      | Use Proxy : La ressource doit être accédée via un proxy.                                                  |
| 307      | Redirection      | Temporary Redirect : La ressource est temporairement déplacée, utiliser la même méthode HTTP.             |
| 308      | Redirection      | Permanent Redirect : Comme 301, mais ne change pas la méthode HTTP utilisée.                              |
| 400      | Erreur client    | Bad Request : Requête mal formée par le client.                                                           |
| 401      | Erreur client    | Unauthorized : Authentification requise pour accéder à la ressource.                                      |
| 402      | Erreur client    | Payment Required : Code réservé à un usage futur.                                                         |
| 403      | Erreur client    | Forbidden : Accès refusé à la ressource.                                                                  |
| 404      | Erreur client    | Not Found : La ressource demandée est introuvable.                                                        |
| 405      | Erreur client    | Method Not Allowed : La méthode HTTP utilisée n'est pas autorisée pour cette ressource.                   |
| 406      | Erreur client    | Not Acceptable : La ressource ne correspond pas aux critères de la requête.                               |
| 407      | Erreur client    | Proxy Authentication Required : Authentification requise par un proxy.                                    |
| 408      | Erreur client    | Request Timeout : Le client a pris trop de temps pour envoyer la requête.                                 |
| 409      | Erreur client    | Conflict : Conflit dans l'état actuel de la ressource.                                                    |
| 410      | Erreur client    | Gone : La ressource n'est plus disponible de façon permanente.                                            |
| 411      | Erreur client    | Length Required : La requête doit indiquer la taille de son corps.                                        |
| 412      | Erreur client    | Precondition Failed : Une condition préalable à la requête a échoué.                                      |
| 413      | Erreur client    | Payload Too Large : Le corps de la requête est trop volumineux.                                           |
| 414      | Erreur client    | URI Too Long : L'URI de la requête est trop long.                                                         |
| 415      | Erreur client    | Unsupported Media Type : Le format de la requête n'est pas supporté.                                      |
| 416      | Erreur client    | Range Not Satisfiable : La plage demandée ne peut pas être fournie.                                       |
| 417      | Erreur client    | Expectation Failed : L'attente du client ne peut pas être satisfaite par le serveur.                      |
| 418      | Erreur client    | I'm a teapot : Code utilisé comme une blague dans le protocole HTTC (RFC 2324).                           |
| 421      | Erreur client    | Misdirected Request : La requête a été dirigée vers un serveur qui ne peut pas y répondre.                |
| 422      | Erreur client    | Unprocessable Entity : La requête est bien formée mais contient des erreurs de logique.                   |
| 423      | Erreur client    | Locked : La ressource est verrouillée.                                                                    |
| 424      | Erreur client    | Failed Dependency : Une requête précédente a échoué, donc celle-ci aussi.                                 |
| 425      | Erreur client    | Too Early : La requête est envoyée trop tôt.                                                              |
| 426      | Erreur client    | Upgrade Required : Le client doit passer à un autre protocole pour continuer.                             |
| 428      | Erreur client    | Precondition Required : Une condition préalable est nécessaire pour traiter la requête.                   |
| 429      | Erreur client    | Too Many Requests : Le client a envoyé trop de requêtes en un laps de temps.                              |
| 431      | Erreur client    | Request Header Fields Too Large : Les champs d'en-tête de la requête sont trop grands.                    |
| 451      | Erreur client    | Unavailable For Legal Reasons : La ressource n'est pas disponible pour des raisons légales.               |
| 500      | Erreur serveur   | Internal Server Error : Le serveur a rencontré une condition inattendue.                                  |
| 501      | Erreur serveur   | Not Implemented : Le serveur ne reconnaît pas ou ne supporte pas la méthode demandée.                     |
| 502      | Erreur serveur   | Bad Gateway : Le serveur agit comme une passerelle et a reçu une réponse invalide.                        |
| 503      | Erreur serveur   | Service Unavailable : Le serveur est temporairement indisponible (surcharge ou maintenance).              |
| 504      | Erreur serveur   | Gateway Timeout : Le serveur, en tant que passerelle, n'a pas reçu de réponse à temps d'un autre serveur. |
| 505      | Erreur serveur   | HTTP Version Not Supported : La version du protocole HTTP n'est pas supportée.                            |
| 506      | Erreur serveur   | Variant Also Negotiates : Erreur de configuration du serveur.                                             |
| 507      | Erreur serveur   | Insufficient Storage : Le serveur n'a pas assez de capacité pour traiter la requête.                      |
| 508      | Erreur serveur   | Loop Detected : Le serveur a détecté une boucle infinie dans le traitement de la requête.                 |
| 510      | Erreur serveur   | Not Extended : Des extensions supplémentaires sont nécessaires pour traiter la requête.                   |
| 511      | Erreur serveur   | Network Authentication Required : Authentification réseau requise pour accéder à la ressource.            |
