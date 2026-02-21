# n8n-nodes-openmrs

![n8n-nodes-openmrs](https://img.shields.io/npm/v/n8n-nodes-openmrs)
![npm](https://img.shields.io/npm/dt/n8n-nodes-openmrs)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This is an n8n community node that provides seamless integration with OpenMRS through standardized FHIR R4 API endpoints. It enables healthcare workflows to access and process electronic medical records data for clinical decision support, data analysis, and interoperability.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## Features

**Comprehensive FHIR R4 Support**

- Access 6 core FHIR resources essential for clinical workflows
- Standardized healthcare data format for maximum interoperability

**Patient Data Management**

- Fetch complete patient demographics and identifiers
- Retrieve encounter history and visit timelines
- Access clinical observations (labs, vitals, diagnostics)

**Clinical Intelligence**

- Diagnostic reports and imaging data
- Condition/diagnosis tracking with staging
- Medication statements and treatment history

**Developer-Friendly**

- Simple authentication with OpenMRS credentials
- Paginated results with customizable limits
- Built-in error handling and retry logic

**Built for Low-Resource Settings**

- Optimized for limited bandwidth environments
- Works with standard OpenMRS installations
- Supports both cloud and on-premise deployments

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-openmrs`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-openmrs
```

For Docker installations:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_CUSTOM_EXTENSIONS="/home/node/.n8n/custom" \
  n8nio/n8n
```

Then install the package inside the container or mount it as a volume.

### Build from Source

```bash
git clone https://github.com/monfortbrian/n8n-nodes-OpenMRS.git
cd n8n-nodes-openmrs
npm install
npm run build
npm link
```

## Credentials

Before using the OpenMRS node, you need to configure credentials:

1. In n8n, go to **Credentials** → **New**
2. Search for **OpenMRS API**
3. Configure:
   - **Base URL**: Your OpenMRS instance URL (e.g., `https://demo.openmrs.org/openmrs`)
   - **Username**: Your OpenMRS username
   - **Password**: Your OpenMRS password

The node uses HTTP Basic Authentication and automatically validates connectivity on save.

## Usage

### Supported Resources

The OpenMRS node provides access to 6 FHIR resources:

| Resource                 | Description                   | Use Cases                                    |
| ------------------------ | ----------------------------- | -------------------------------------------- |
| **Patient**              | Demographics, identifiers     | Identity verification, cohort analysis       |
| **Encounter**            | Visits, admissions            | Timeline reconstruction, visit patterns      |
| **Observation**          | Labs, vitals, diagnostics     | Trend analysis, risk detection               |
| **Diagnostic Report**    | Imaging, pathology            | Disease progression, treatment response      |
| **Condition**            | Diagnoses, problem lists      | Differential diagnosis, comorbidity tracking |
| **Medication Statement** | Active/historical medications | Treatment history, drug interactions         |

### Operations

Each resource supports:

- **Get a resource** - Retrieve a single resource by ID
- **Get all resources** - Retrieve all resources for a patient (with pagination)

## Examples

### Example 1: Fetch Patient Demographics

```
1. Add OpenMRS node
2. Select Resource: Patient
3. Select Operation: Get a resource
4. Enter Patient ID: abc-123-def-456
5. Execute
```

**Output:**

```json
{
  "resourceType": "Patient",
  "id": "abc-123-def-456",
  "name": [
    {
      "given": ["John"],
      "family": "Doe"
    }
  ],
  "gender": "male",
  "birthDate": "1957-03-15"
}
```

### Example 2: Retrieve Patient Lab Results

```
1. Add OpenMRS node
2. Select Resource: Observation
3. Select Operation: Get all resources
4. Enter Patient ID: abc-123-def-456
5. Set Limit: 50
6. Execute
```

**Output:** Returns up to 50 lab observations with values, units, and reference ranges.

### Example 3: Get Patient Diagnosis History

```
1. Add OpenMRS node
2. Select Resource: Condition
3. Select Operation: Get all resources
4. Enter Patient ID: abc-123-def-456
5. Select Return All: true (for complete history)
6. Execute
```

### Example 4: Clinical Decision Support Workflow

Build an intelligent ASSESS workflow:

```
[OpenMRS Patient]    ──┐
[OpenMRS Encounters]   ├─→ [Normalize Data] → [LLM Analysis] → [Alert Doctor]
[OpenMRS Labs]    ─────┘
```

This workflow:

1. Fetches patient demographics, encounters, and lab results
2. Normalizes FHIR data into unified format
3. Analyzes trends using AI
4. Generates clinical insights

## Options

### Common Parameters

| Parameter  | Type     | Description                  | Required                  |
| ---------- | -------- | ---------------------------- | ------------------------- |
| Resource   | Dropdown | FHIR resource type           | Yes                       |
| Operation  | Dropdown | Get or Get All               | Yes                       |
| Patient ID | String   | UUID of the patient          | Yes (for most operations) |
| Return All | Boolean  | Fetch all results (no limit) | No                        |
| Limit      | Number   | Max results (1-100)          | No (default: 50)          |

### Resource-Specific Parameters

**Encounter:**

- Encounter ID (for Get operation)

**Condition:**

- Condition ID (for Get operation)

**Medication Statement:**

- Medication Statement ID (for Get operation)

### Pagination

For `Get all resources` operations:

- Set **Return All** to `true` for complete datasets
- Or set **Limit** to control result size (1-100)
- Results are returned in FHIR Bundle format

## API Endpoints

This node uses OpenMRS FHIR2 R4 endpoints:

```
GET /ws/fhir2/R4/Patient/{id}
GET /ws/fhir2/R4/Patient?_count=50

GET /ws/fhir2/R4/Encounter?patient={id}&_count=50

GET /ws/fhir2/R4/Observation?patient={id}&_count=50

GET /ws/fhir2/R4/DiagnosticReport?patient={id}&_count=50

GET /ws/fhir2/R4/Condition?patient={id}&_count=50

GET /ws/fhir2/R4/MedicationStatement?patient={id}&_count=50
```

## Use Cases

### Clinical Decision Support

- Reconstruct patient timelines
- Detect missed clinical signals
- Flag abnormal lab trends
- Track disease progression

### Data Analytics

- Population health analysis
- Cohort identification
- Treatment outcome tracking
- Quality metrics reporting

### Interoperability

- Sync data between systems
- Export for external analysis
- Integration with AI/ML pipelines
- REDCap or DHIS2 data flows

### Global Health

- Low-resource oncology workflows
- HIV/TB treatment tracking
- Maternal health monitoring
- Vaccine registry management

## Compatibility

- **n8n version:** 0.187.0 or higher
- **OpenMRS version:** 2.3+ with FHIR2 module installed
- **Node.js:** 18.0.0 or higher

## Development

### Building

```bash
npm run build
npm run dev
```

### Testing Locally

```bash
npm link
cd ~/.n8n/custom
npm link n8n-nodes-openmrs
n8n start
```

## Troubleshooting

### Node doesn't appear in n8n

1. Verify package is installed: `npm list -g n8n-nodes-openmrs`
2. Clear n8n cache: `rm -rf ~/.n8n/cache`
3. Restart n8n
4. Hard refresh browser (Ctrl+Shift+R)

### Authentication errors

- Verify Base URL includes `/openmrs` path (e.g., `https://demo.openmrs.org/openmrs`)
- Confirm username/password are correct
- Check OpenMRS FHIR2 module is installed and enabled

### Empty results

- Confirm patient UUID exists in your OpenMRS instance
- Verify patient has data for the requested resource type
- Check FHIR2 module configuration in OpenMRS

## Resources

- [OpenMRS Documentation](https://wiki.openmrs.org/)
- [FHIR R4 Specification](https://hl7.org/fhir/R4/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [OpenMRS FHIR2 Module](https://wiki.openmrs.org/display/projects/FHIR+Module)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

Copyright (c) 2026 Monfort N. Brian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

- **Issues:** [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-OpenMRS/issues)
- **Discussions:** [GitHub Discussions](https://github.com/monfortbrian/n8n-nodes-OpenMRS/discussions)
- **n8n Community:** [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

Built for healthcare workers in low-resource settings. Designed to enable clinical decision support and improve patient outcomes through better data interoperability.

---

**Made with ❤️ for the global health community**
