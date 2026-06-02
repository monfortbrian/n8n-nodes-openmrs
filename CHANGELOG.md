# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.3.0] - 2026-06-02

### Added
- **Patient: Create** POST to `/ws/fhir2/R4/Patient`. Accepts a full FHIR Patient resource as JSON. Required fields: resourceType, name, gender, birthDate. Supports identifiers, telecom (phone), and address.
- **Encounter: Create** POST to `/ws/fhir2/R4/Encounter`. Accepts a full FHIR Encounter resource as JSON. Required fields: resourceType, status, class, subject (Patient reference), period. Enables the KoboToolbox → OpenMRS → DHIS2 pipeline without falling back to Custom API Call.

---

## [1.2.1] - 2026-03-06

### Fixed
- Minor type corrections and build cleanup.

---

## [1.2.0] - 2026-03-05

### Added
- Patient search by OpenMRS ID / identifier
- Patient search by name (partial matching)
- Patient search by phone number
- Custom API Call resource for direct FHIR endpoint access

---

## [1.1.0] - 2026-03-03

### Added
- Encounter, Observation, DiagnosticReport, Condition, MedicationStatement resources
- Get and Get Many operations for all resources
- Patient ID filter for Get Many operations
- Pagination with Return All and Limit controls

---

## [1.0.0] - 2026-03-01

### Added
- Initial release
- Patient resource: Get, Get Many
- Basic Auth credential with `/ws/rest/v1/session` test
- `usableAsTool` support for AI Agent workflows