# n8n-nodes-openmrs

[![npm](https://img.shields.io/npm/v/n8n-nodes-openmrs)](https://www.npmjs.com/package/n8n-nodes-openmrs)
[![npm downloads](https://img.shields.io/npm/dt/n8n-nodes-openmrs)](https://www.npmjs.com/package/n8n-nodes-openmrs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

n8n community node for [OpenMRS](https://openmrs.org) FHIR R4 API. Register patients, create encounters, search clinical records, and build interoperability.
[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

---

## Installation

**Via n8n UI:** Search DHIS2 as verified node or simply go to Settings → Community Nodes → `n8n-nodes-dhis2`

**Via npm:**
```bash
npm install n8n-nodes-dhis2
```

---

## Credentials

| Field    | Description |
|----------|-------------|
| Base URL | Your OpenMRS instance including `/openmrs` (e.g. `https://demo.openmrs.org/openmrs`) |
| Username | OpenMRS username |
| Password | OpenMRS password |

Demo: `https://demo.openmrs.org/openmrs` — username `admin`, password `Admin123`

---

## Resources & Operations

| Resource             | Operations |
|----------------------|------------|
| Patient              | Create, Get, Get Many, Search by Identifier, Search by Name, Search by Phone |
| Encounter            | Create, Get, Get Many |
| Observation          | Get, Get Many |
| Diagnostic Report    | Get, Get Many |
| Condition            | Get, Get Many |
| Medication Statement | Get, Get Many |
| Custom API Call      | Any method, any FHIR endpoint |

---

## Example: Register a Patient

```
Resource:   Patient
Operation:  Create
Payload:
{
  "resourceType": "Patient",
  "identifier": [{ "system": "http://openmrs.org/identifier", "value": "CASE-001" }],
  "name": [{ "family": "Nkurunziza", "given": ["Brian"] }],
  "gender": "male",
  "birthDate": "1995-03-15",
  "telecom": [{ "system": "phone", "value": "+250788123456" }]
}
```

Returns the created FHIR Patient resource including the assigned OpenMRS UUID.

---

## Example: Create an Encounter

```
Resource:   Encounter
Operation:  Create
Payload:
{
  "resourceType": "Encounter",
  "status": "finished",
  "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB" },
  "subject": { "reference": "Patient/PATIENT_UUID" },
  "period": { "start": "2026-06-02T08:00:00+00:00", "end": "2026-06-02T09:00:00+00:00" }
}
```

Replace `PATIENT_UUID` with the UUID returned from Patient Create.

---

## Compatibility

- **OpenMRS:** 2.3+ with FHIR2 module enabled
- **n8n:** 1.0+
- **Node.js:** 22+

---

## API Reference

```
POST /ws/fhir2/R4/Patient
GET  /ws/fhir2/R4/Patient/{uuid}
GET  /ws/fhir2/R4/Patient?identifier={id}
GET  /ws/fhir2/R4/Patient?name={name}
GET  /ws/fhir2/R4/Patient?telecom={phone}

POST /ws/fhir2/R4/Encounter
GET  /ws/fhir2/R4/Encounter/{uuid}
GET  /ws/fhir2/R4/Encounter?patient={uuid}&_count=50

GET  /ws/fhir2/R4/Observation?patient={uuid}&_count=50
GET  /ws/fhir2/R4/DiagnosticReport?patient={uuid}&_count=50
GET  /ws/fhir2/R4/Condition?patient={uuid}&_count=50
GET  /ws/fhir2/R4/MedicationStatement?patient={uuid}&_count=50
```

---

## Resources

- [DHIS2 Documentation](https://docs.dhis2.org/)
- [DHIS2 Web API Guide](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html)
- [DHIS2 Demo Server](https://play.dhis2.org)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [OpenMRS n8n Node](https://www.npmjs.com/package/n8n-nodes-openmrs) clinical data from OpenMRS
- [RapidPro n8n Node](https://www.npmjs.com/package/n8n-nodes-rapidpro) messaging workflows via RapidPro

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

[MIT License](LICENSE)

Copyright (c) 2026 [Monfort Brian N.](https://github.com/monfortbrian)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-dhis2/issues)
- **n8n Community:** [n8n Community Forum](https://community.n8n.io/)

---

## Acknowledgments

Built for healthcare workers in low-resource settings. Enabling better patient outcomes through data interoperability and workflow automation.

---

**Made with ❤️ for the global health community**