# n8n-nodes-openmrs

[![npm version](https://img.shields.io/npm/v/n8n-nodes-openmrs)](https://www.npmjs.com/package/n8n-nodes-openmrs)
[![npm downloads](https://img.shields.io/npm/dt/n8n-nodes-openmrs)](https://www.npmjs.com/package/n8n-nodes-openmrs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Community node for [n8n](https://n8n.io/) providing OpenMRS FHIR R4 integration with intelligent patient search, clinical data access, and healthcare workflow automation.

---

## What's New in v1.2.0

**Smart Patient Search** - No more memorizing UUIDs!
- Search by OpenMRS ID: `131280865`
- Search by Name: `Patricia Lewis` (partial matching)
- Search by Phone: `+254712345678`

---

## Features

### Intelligent Patient Lookup

Real-world clinics don't use UUIDs. Search patients the way healthcare workers actually do:

- **By Identifier** - OpenMRS ID, National ID, Facility Number
- **By Name** - First name, last name, or partial matches
- **By Phone** - Mobile number in any format
- **By UUID** - For system integrations

### Complete FHIR R4 Coverage

Access all essential clinical resources:

| Resource | What You Get | Common Use Cases |
|----------|-------------|------------------|
| **Patient** | Demographics, identifiers, contacts | Registration, identity verification |
| **Encounter** | Visits, admissions, consultations | Attendance tracking, visit history |
| **Observation** | Labs, vitals, diagnostic results | Trend analysis, clinical alerts |
| **Diagnostic Report** | Imaging, pathology reports | Disease progression tracking |
| **Condition** | Diagnoses, active problems | Differential diagnosis, comorbidities |
| **Medication Statement** | Current & past medications | Treatment history, drug interactions |

### Developer-Friendly

- **Simple Auth** - HTTP Basic Authentication
- **Pagination** - Handle large datasets efficiently
- **Error Handling** - Clear error messages and continue-on-fail support
- **Custom API Calls** - Direct access to any OpenMRS FHIR endpoint

### Built for Global Health

- Optimized for low-bandwidth environments
- Works with OpenMRS 2.x and 3.x
- Compatible with DHIS2 workflows
- Supports both cloud and on-premise deployments

---

## Installation

### Via n8n Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-openmrs`
5. Click **Install**

### Via npm
```bash
npm install n8n-nodes-openmrs
```

### From Source
```bash
git clone https://github.com/monfortbrian/n8n-nodes-openmrs.git
cd n8n-nodes-openmrs
npm install
npm run build
npm link
```

---

## Quick Start

### 1. Configure Credentials

1. In n8n, go to **Credentials** → **New**
2. Search for **OpenMRS API**
3. Configure:
   - **Base URL**: `https://demo.openmrs.org/openmrs` (include `/openmrs`)
   - **Username**: `admin`
   - **Password**: `Admin123`
4. Test & Save

### 2. Search Patient by OpenMRS ID
```
Add Node → OpenMRS
├─ Resource: Patient
├─ Operation: Search by Identifier
└─ Identifier: 131280865
```

**Result:** Complete patient record instantly

### 3. Find Patient by Name
```
Add Node → OpenMRS
├─ Resource: Patient
├─ Operation: Search by Name
└─ Name: Patricia
```

**Result:** All patients with "Patricia" in their name

---

## Examples

### Example 1: Patient Search by ID (Real-World)

**Instead of this (nobody remembers):**
```
UUID: 7826f08a-0258-4fb1-ba69-2af192f392db
```

**Do this:**
```
OpenMRS ID: 131280865
```

**n8n Workflow:**
1. Add OpenMRS node
2. Resource: **Patient**
3. Operation: **Search by Identifier**
4. Identifier: `131280865`
5. Execute

**Output:** Full patient FHIR record

---

### Example 2: Get Patient Lab Results
```
1. Add OpenMRS node
2. Resource: Observation
3. Operation: Get Many
4. Patient UUID: 7826f08a-0258-4fb1-ba69-2af192f392db
5. Limit: 50
6. Execute
```

**Output:** Up to 50 most recent lab results with values, units, reference ranges

---

### Example 3: Track Patient Visit History
```
1. Add OpenMRS node
2. Resource: Encounter
3. Operation: Get Many
4. Patient UUID: 7826f08a-0258-4fb1-ba69-2af192f392db
5. Return All: true
6. Execute
```

**Output:** Complete visit timeline from first to last encounter

---

### Example 4: Custom FHIR Query

Use the **Custom API Call** resource for advanced queries:
```
1. Add OpenMRS node
2. Resource: Custom API Call
3. HTTP Method: GET
4. Endpoint: /ws/fhir2/R4/Patient
5. Query Parameters:
   - name: birthdate
   - value: gt1990-01-01
6. Execute
```

**Output:** All patients born after January 1, 1990

---

## Real-World Use Cases

### Clinical Workflows

**Patient Admission Dashboard**
```
Webhook Trigger
→ OpenMRS: Search by OpenMRS ID
→ OpenMRS: Get Encounters (last 6 months)
→ OpenMRS: Get Observations (recent labs)
→ Code: Calculate risk scores
→ Display: Admission summary
```

**Lost-to-Follow-Up Recovery**
```
Schedule (weekly)
→ OpenMRS: Get All Patients on ART
→ Code: Filter last visit > 28 days
→ OpenMRS: Search by Phone
→ SMS: "Medication ready for pickup"
→ DHIS2: Update tracker
```

### Data Analytics

**Disease Surveillance**
```
Schedule (every 6 hours)
→ OpenMRS: Get Conditions (last 6h)
→ Code: Filter cholera, measles, meningitis
→ Code: Check outbreak threshold
→ DHIS2: Post to IDSR module
→ SMS: Alert district officer
```

**Lab Turnaround Time Monitoring**
```
OpenMRS: Observation created
→ Calculate: Order time - Result time
→ IF > 48 hours
  → Alert lab manager
  → DHIS2: Post performance indicator
```

### Global Health

- HIV/TB treatment adherence tracking
- Maternal health visit reminders
- Vaccine defaulter identification
- Stockout prevention for ARVs

---

## API Reference

### Supported Resources

- `Patient` - Demographics, identifiers
- `Encounter` - Visits, admissions
- `Observation` - Labs, vitals, diagnostics
- `Diagnostic Report` - Imaging, pathology
- `Condition` - Diagnoses, problems
- `Medication Statement` - Prescriptions, dispensing
- `Custom API Call` - Any FHIR endpoint

### Patient Operations

- **Search by Identifier** - OpenMRS ID, National ID
- **Search by Name** - Partial name matching
- **Search by Phone** - Phone number search
- **Get** - Retrieve by UUID
- **Get Many** - Retrieve all (paginated)

### Other Resource Operations

- **Get** - Retrieve single resource by UUID
- **Get Many** - Retrieve all for patient (paginated)

### Pagination

All `Get Many` and search operations support:
- **Return All**: `true/false`
- **Limit**: `1-100` (default: 50)

---

## FHIR Endpoints Used
```
GET /ws/fhir2/R4/Patient?identifier={id}
GET /ws/fhir2/R4/Patient?name={name}
GET /ws/fhir2/R4/Patient?telecom={phone}
GET /ws/fhir2/R4/Patient/{uuid}
GET /ws/fhir2/R4/Encounter?patient={uuid}&_count=50
GET /ws/fhir2/R4/Observation?patient={uuid}&_count=50
GET /ws/fhir2/R4/DiagnosticReport?patient={uuid}&_count=50
GET /ws/fhir2/R4/Condition?patient={uuid}&_count=50
GET /ws/fhir2/R4/MedicationStatement?patient={uuid}&_count=50
```

---

## Compatibility

- **n8n**: 0.187.0 or higher
- **OpenMRS**: 2.3+ with FHIR2 module
- **Node.js**: 18.0.0 or higher

---

## Troubleshooting

### Node doesn't appear
```bash
# Check installation
npm list -g n8n-nodes-openmrs

# Clear cache
rm -rf ~/.n8n/cache

# Restart n8n
n8n start
```

### Authentication fails

- Include `/openmrs` in Base URL
- Verify credentials in OpenMRS
- Check FHIR2 module is enabled

### Empty search results

- Patient may not exist with that identifier
- Try different search criteria
- Verify FHIR2 module configuration

### Build errors (for developers)
```bash
# Clean rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Development

### Building
```bash
npm run build      # Compile TypeScript
npm run dev        # Watch mode
npm run lint       # Check code quality
npm run lintfix    # Auto-fix issues
```

### Testing Locally
```bash
# Build and link
npm run build
npm link

# Start n8n
n8n start

# Test in n8n UI
# Your node appears as "OpenMRS"
```

### Publishing
```bash
# Bump version
npm version minor  # 1.1.0 → 1.2.0

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## Changelog

### [1.2.0] - 2026-03-05

**Added**
- Patient search by OpenMRS ID/identifier
- Patient search by name (partial matching)
- Patient search by phone number
- Custom API Call resource for advanced queries

**Changed**
- Improved error messages
- Better TypeScript types
- Updated documentation

### [1.1.0] - 2026-03-03

**Added**
- 6 FHIR resources (Patient, Encounter, Observation, etc.)
- Get and Get Many operations
- Pagination support

### [1.0.0] - 2026-03-01

**Added**
- Initial release
- Basic FHIR R4 support

---

## License

[MIT License](LICENSE)

Copyright © 2026 Monfort Brian N.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-openmrs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/monfortbrian/n8n-nodes-openmrs/discussions)
- **n8n Community**: [n8n Forum](https://community.n8n.io/)

---

## Acknowledgments

Built for healthcare workers in low-resource settings. Enabling better patient outcomes through data interoperability and workflow automation.

**Made with ❤️ for global health**
