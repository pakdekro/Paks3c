Exemple :

```json
{
  "type": "bundle",
  "id": "bundle--3c4f8b42-47f2-4976-bf3a-2bd57e67b63c",
  "spec_version": "2.1",
  "objects": [
    {
      "type": "threat-actor",
      "id": "threat-actor--8e6a4f12-132b-4c6f-b3a3-621bdc7f94b5",
      "created": "2025-03-10T10:00:00.000Z",
      "modified": "2025-03-10T10:00:00.000Z",
      "name": "APT-42",
      "description": "Un groupe APT connu pour des attaques ciblées sur des infrastructures critiques.",
      "threat_actor_types": ["nation-state"],
      "aliases": ["Groupe Fantôme"],
      "roles": ["sponsor"],
      "primary_motivation": "espionage"
    },
    {
      "type": "malware",
      "id": "malware--3d3b4a44-d8f3-4c67-8051-9b1f3235f46a",
      "created": "2025-03-10T10:00:00.000Z",
      "modified": "2025-03-10T10:00:00.000Z",
      "name": "ShadowSpy",
      "description": "Un malware utilisé par APT-42 pour la collecte de données.",
      "malware_types": ["remote-access-trojan"],
      "is_family": false
    },
    {
      "type": "indicator",
      "id": "indicator--d7e4d6f7-52df-4b89-9b71-d54352f42d56",
      "created": "2025-03-10T10:00:00.000Z",
      "modified": "2025-03-10T10:00:00.000Z",
      "name": "IP suspecte de ShadowSpy",
      "description": "Cette adresse IP est associée aux activités du malware ShadowSpy.",
      "indicator_types": ["malicious-activity"],
      "pattern": "[ipv4-addr:value = '203.0.113.45']",
      "pattern_type": "stix",
      "valid_from": "2025-03-10T10:00:00.000Z"
    },
    {
      "type": "attack-pattern",
      "id": "attack-pattern--6f2d63ab-60cd-4984-8c3c-e40f7df60e2f",
      "created": "2025-03-10T10:00:00.000Z",
      "modified": "2025-03-10T10:00:00.000Z",
      "name": "Phishing via pièce jointe malveillante",
      "description": "Utilisation d'un document Word piégé pour exécuter un malware.",
      "external_references": [
        {
          "source_name": "MITRE ATT&CK",
          "url": "https://attack.mitre.org/techniques/T1566/001/",
          "external_id": "T1566.001"
        }
      ]
    },
    {
      "type": "observed-data",
      "id": "observed-data--c9b9c9d4-b792-4d1c-bf7a-3e5ff2b172e8",
      "created": "2025-03-10T10:00:00.000Z",
      "modified": "2025-03-10T10:00:00.000Z",
      "first_observed": "2025-03-09T22:15:00.000Z",
      "last_observed": "2025-03-09T22:30:00.000Z",
      "number_observed": 3,
      "object_refs": ["ipv4-addr--a67dbd13-9c6e-4f76-91f8-3cfb67a7b0b7"]
    },
    {
      "type": "ipv4-addr",
      "id": "ipv4-addr--a67dbd13-9c6e-4f76-91f8-3cfb67a7b0b7",
      "value": "203.0.113.45"
    },
    {
      "type": "relationship",
      "id": "relationship--e6b3498c-7c2c-4a8f-b02b-1e0b5f1d5c44",
      "relationship_type": "uses",
      "source_ref": "threat-actor--8e6a4f12-132b-4c6f-b3a3-621bdc7f94b5",
      "target_ref": "malware--3d3b4a44-d8f3-4c67-8051-9b1f3235f46a",
      "description": "APT-42 utilise ShadowSpy pour espionner ses cibles."
    },
    {
      "type": "relationship",
      "id": "relationship--f3a9c1d6-2d4e-48ad-9a5b-3f23f76e2a16",
      "relationship_type": "indicates",
      "source_ref": "indicator--d7e4d6f7-52df-4b89-9b71-d54352f42d56",
      "target_ref": "malware--3d3b4a44-d8f3-4c67-8051-9b1f3235f46a",
      "description": "L'indicateur IP est lié au malware ShadowSpy."
    },
    {
      "type": "relationship",
      "id": "relationship--d2e16b59-f798-4c43-9a5d-4b8c516b63ab",
      "relationship_type": "uses",
      "source_ref": "malware--3d3b4a44-d8f3-4c67-8051-9b1f3235f46a",
      "target_ref": "attack-pattern--6f2d63ab-60cd-4984-8c3c-e40f7df60e2f",
      "description": "Le malware ShadowSpy est propagé via un phishing avec document piégé."
    }
  ]
}
```

