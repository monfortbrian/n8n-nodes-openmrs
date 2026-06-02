# n8n-nodes-openmrs

[![npm](https://img.shields.io/npm/v/n8n-nodes-openmrs)](https://www.npmjs.com/package/n8n-nodes-openmrs)
[![npm downloads](https://img.shields.io/npm/dt/n8n-nodes-openmrs)](https://www.npmjs.com/package/n8n-nodes-openmrs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

n8n community node for [OpenMRS](https://openmrs.org) FHIR R4 API. Register patients, create encounters, search clinical records, and connect OpenMRS to DHIS2, RapidPro, and other health systems.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

---

## Installation

**Via n8n UI:** Settings → Community Nodes → search `n8n-nodes-openmrs` → Install

**Via npm:**
```bash
npm install n8n-nodes-openmrs
```

---

## Credentials

| Field    | Description |
|----------|-------------|
| Base URL | Your OpenMRS instance including `/openmrs` (e.g. `https://o3.openmrs.org/openmrs`) |
| Username | OpenMRS username |
| Password | OpenMRS password |

Demo: `https://o3.openmrs.org/openmrs` username `admin`, password `Admin123`

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

```json
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

```json
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

- [OpenMRS Documentation](https://wiki.openmrs.org/)
- [OpenMRS FHIR2 Module](https://wiki.openmrs.org/display/projects/FHIR+Module)
- [OpenMRS REST API](https://rest.openmrs.org/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n-nodes-dhis2](https://www.npmjs.com/package/n8n-nodes-dhis2) DHIS2 integration
- [n8n-nodes-rapidpro](https://www.npmjs.com/package/n8n-nodes-rapidpro) RapidPro messaging

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat(openmrs): your change'`
4. Push and open a Pull Request

---

## Support

- **Issues:** [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-openmrs/issues)
- **n8n Community:** [community.n8n.io](https://community.n8n.io/)

---

## License

[MIT](LICENSE) © 2026 [Monfort Brian N. | 宁俊](https://github.com/monfortbrian)

---

## Acknowledgments

Built to connect clinical systems to national health information infrastructure. Part of an open-source interoperability stack for outbreak response and healthcare orchestration across low-resource settings.