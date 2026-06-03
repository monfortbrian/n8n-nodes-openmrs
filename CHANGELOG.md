# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.3.1] - 2026-06-02

### Fixed
- README referenced wrong package names, install commands, GitHub issues URL, and resources section copied from n8n-nodes-dhis2. All references corrected to n8n-nodes-openmrs.
- Published via GitHub Actions with npm provenance to meet n8n verified node requirements (provenance was missing from v1.3.0).

---

## [1.3.0] - 2026-06-02

### Added
- **Patient: Create** POST to `/ws/fhir2/R4/Patient`. Accepts a full FHIR Patient resource as JSON. Required fields: `resourceType`, `name`, `gender`, `birthDate`. Supports identifiers, telecom (phone), and address.
- **Encounter: Create** POST to `/ws/fhir2/R4/Encounter`. Accepts a full FHIR Encounter resource as JSON. Required fields: `resourceType`, `status`, `class`, `subject` (Patient reference), `period`. Enables the KoboToolbox → OpenMRS → DHIS2 pipeline without falling back to Custom API Call.

---

## [1.2.1] - 2026-03-06

### Fixed
- Minor type corrections and build cleanup.

---

## [1.2.0] - 2026-03-05

### Added
- Patient search by OpenMRS ID / identifier via `?identifier=`
- Patient search by name (partial matching) via `?name=`
- Patient search by phone number via `?telecom=`
- Custom API Call resource for direct access to any FHIR endpoint

---

## [1.1.0] - 2026-03-03

### Added
- Encounter, Observation, DiagnosticReport, Condition, MedicationStatement resources
- Get and Get Many operations for all resources
- Patient ID filter on Get Many operations
- Pagination: Return All toggle and configurable Limit (1–100)

---

## [1.0.0] - 2026-03-01

### Added
- Initial release
- Patient resource: Get, Get Many
- Basic Auth credential with `/ws/rest/v1/session` connectivity test
- `usableAsTool` flag for AI Agent workflows