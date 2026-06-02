import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class OpenMrs implements INodeType {
	usableAsTool = true;
	description: INodeTypeDescription = {
		displayName: 'OpenMRS',
		name: 'openMrs',
		icon: 'file:openMrs.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with OpenMRS FHIR R4 API',
		defaults: {
			name: 'OpenMRS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'openMrsApi',
				required: true,
			},
		],
		properties: [
			// ===== RESOURCE =====
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Condition', value: 'condition' },
					{ name: 'Custom API Call', value: 'customApiCall' },
					{ name: 'Diagnostic Report', value: 'diagnosticReport' },
					{ name: 'Encounter', value: 'encounter' },
					{ name: 'Medication Statement', value: 'medicationStatement' },
					{ name: 'Observation', value: 'observation' },
					{ name: 'Patient', value: 'patient' },
				],
				default: 'patient',
			},

			// ===== PATIENT OPERATIONS =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['patient'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Register a new patient',
						action: 'Create a patient',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a patient by UUID',
						action: 'Get a patient',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many patients',
						action: 'Get many patients',
					},
					{
						name: 'Search by Identifier',
						value: 'searchByIdentifier',
						description: 'Search patient by OpenMRS ID or National ID',
						action: 'Search patient by identifier',
					},
					{
						name: 'Search by Name',
						value: 'searchByName',
						description: 'Search patient by name (partial match supported)',
						action: 'Search patient by name',
					},
					{
						name: 'Search by Phone',
						value: 'searchByPhone',
						description: 'Search patient by phone number',
						action: 'Search patient by phone',
					},
				],
				default: 'searchByIdentifier',
			},

			// ===== ENCOUNTER OPERATIONS =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['encounter'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new encounter for a patient',
						action: 'Create an encounter',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an encounter by UUID',
						action: 'Get an encounter',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many encounters for a patient',
						action: 'Get many encounters',
					},
				],
				default: 'get',
			},

			// ===== OTHER RESOURCE OPERATIONS =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['observation', 'diagnosticReport', 'condition', 'medicationStatement'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a resource by UUID',
						action: 'Get a resource',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many resources for a patient',
						action: 'Get many resources',
					},
				],
				default: 'get',
			},

			// ===== CUSTOM API CALL OPERATION =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['customApiCall'] } },
				options: [
					{
						name: 'Custom API Call',
						value: 'customApiCall',
						description: 'Make a custom API call to OpenMRS',
						action: 'Make custom API call',
					},
				],
				default: 'customApiCall',
			},

			// ===== PATIENT CREATE FIELDS =====
			{
				displayName: 'Patient (FHIR JSON)',
				name: 'patientPayload',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['patient'], operation: ['create'] } },
				default: '{\n  "resourceType": "Patient",\n  "identifier": [\n    {\n      "system": "http://openmrs.org/identifier",\n      "value": "PATIENT-001"\n    }\n  ],\n  "name": [\n    {\n      "family": "Doe",\n      "given": ["John"]\n    }\n  ],\n  "gender": "male",\n  "birthDate": "1990-01-01",\n  "telecom": [\n    {\n      "system": "phone",\n      "value": "+250788123456"\n    }\n  ]\n}',
				description: 'Full FHIR Patient resource. Must include resourceType, name, gender, birthDate.',
			},

			// ===== ENCOUNTER CREATE FIELDS =====
			{
				displayName: 'Encounter (FHIR JSON)',
				name: 'encounterPayload',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['encounter'], operation: ['create'] } },
				default: '{\n  "resourceType": "Encounter",\n  "status": "finished",\n  "class": {\n    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n    "code": "AMB",\n    "display": "ambulatory"\n  },\n  "subject": {\n    "reference": "Patient/PATIENT_UUID"\n  },\n  "period": {\n    "start": "2026-06-02T08:00:00+00:00",\n    "end": "2026-06-02T09:00:00+00:00"\n  },\n  "type": [\n    {\n      "coding": [\n        {\n          "system": "http://snomed.info/sct",\n          "code": "11429006",\n          "display": "Consultation"\n        }\n      ]\n    }\n  ]\n}',
				description: 'Full FHIR Encounter resource. Must include resourceType, status, class, subject (Patient reference), and period.',
			},

			// ===== SEARCH FIELDS =====
			{
				displayName: 'Identifier',
				name: 'identifier',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['patient'], operation: ['searchByIdentifier'] } },
				default: '',
				placeholder: '131280865',
				description: 'OpenMRS ID or National ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['patient'], operation: ['searchByName'] } },
				default: '',
				placeholder: 'Patricia Lewis',
				description: 'Patient name (supports partial matching)',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['patient'], operation: ['searchByPhone'] } },
				default: '',
				placeholder: '+254712345678',
				description: 'Phone number in any format',
			},

			// ===== GET BY UUID FIELDS =====
			{
				displayName: 'Patient ID',
				name: 'patientId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['patient'], operation: ['get'] } },
				default: '',
				description: 'The UUID of the patient',
			},
			{
				displayName: 'Encounter ID',
				name: 'encounterId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['encounter'], operation: ['get'] } },
				default: '',
				description: 'The UUID of the encounter',
			},
			{
				displayName: 'Observation ID',
				name: 'observationId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['observation'], operation: ['get'] } },
				default: '',
				description: 'The UUID of the observation',
			},
			{
				displayName: 'Diagnostic Report ID',
				name: 'diagnosticReportId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['diagnosticReport'], operation: ['get'] } },
				default: '',
				description: 'The UUID of the diagnostic report',
			},
			{
				displayName: 'Condition ID',
				name: 'conditionId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['condition'], operation: ['get'] } },
				default: '',
				description: 'The UUID of the condition',
			},
			{
				displayName: 'Medication Statement ID',
				name: 'medicationStatementId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['medicationStatement'], operation: ['get'] } },
				default: '',
				description: 'The UUID of the medication statement',
			},

			// ===== CUSTOM API CALL FIELDS =====
			{
				displayName: 'HTTP Method',
				name: 'httpMethod',
				type: 'options',
				displayOptions: { show: { resource: ['customApiCall'] } },
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
				],
				default: 'GET',
				description: 'The HTTP method to use',
			},
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['customApiCall'] } },
				default: '/ws/fhir2/R4/Patient',
				placeholder: '/ws/fhir2/R4/Patient',
				description: 'The API endpoint (e.g., /ws/fhir2/R4/Patient)',
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: { show: { resource: ['customApiCall'] } },
				default: {},
				placeholder: 'Add Parameter',
				options: [
					{
						name: 'parameter',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},

			// ===== GET MANY PATIENT FILTER =====
			{
				displayName: 'Patient ID',
				name: 'patientIdFilter',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['encounter', 'observation', 'diagnosticReport', 'condition', 'medicationStatement'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The UUID of the patient to filter results by',
			},

			// ===== PAGINATION =====
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll', 'searchByIdentifier', 'searchByName', 'searchByPhone'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll', 'searchByIdentifier', 'searchByName', 'searchByPhone'],
						returnAll: [false],
					},
				},
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				description: 'Max number of results to return',
			},
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('openMrsApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		const fhirResourceMap: Record<string, string> = {
			patient: 'Patient',
			encounter: 'Encounter',
			observation: 'Observation',
			diagnosticReport: 'DiagnosticReport',
			condition: 'Condition',
			medicationStatement: 'MedicationStatement',
		};

		const resourceIdParamMap: Record<string, string> = {
			patient: 'patientId',
			encounter: 'encounterId',
			observation: 'observationId',
			diagnosticReport: 'diagnosticReportId',
			condition: 'conditionId',
			medicationStatement: 'medicationStatementId',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let endpoint = '';
				const qs: IDataObject = {};

				// ----------------------------------------------------------------
				// Custom API Call returns early
				// ----------------------------------------------------------------
				if (resource === 'customApiCall') {
					const httpMethod = this.getNodeParameter('httpMethod', i) as IHttpRequestMethods;
					endpoint = this.getNodeParameter('endpoint', i) as string;

					const queryParameters = this.getNodeParameter('queryParameters', i, {}) as IDataObject;
					if (queryParameters.parameter && Array.isArray(queryParameters.parameter)) {
						for (const param of queryParameters.parameter as Array<{ name: string; value: string }>) {
							qs[param.name] = param.value;
						}
					}

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'openMrsApi',
						{
							method: httpMethod,
							url: `${baseUrl}${endpoint}`,
							qs,
							json: true,
						},
					);

					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
					continue;
				}

				// ----------------------------------------------------------------
				// Patient: Create POST, returns early
				// ----------------------------------------------------------------
				if (resource === 'patient' && operation === 'create') {
					const raw = this.getNodeParameter('patientPayload', i) as string;
					const body = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw)) as IDataObject;

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'openMrsApi',
						{
							method: 'POST',
							url: `${baseUrl}/ws/fhir2/R4/Patient`,
							body,
							json: true,
						},
					);

					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
					continue;
				}

				// ----------------------------------------------------------------
				// Encounter: Create POST, returns early
				// ----------------------------------------------------------------
				if (resource === 'encounter' && operation === 'create') {
					const raw = this.getNodeParameter('encounterPayload', i) as string;
					const body = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw)) as IDataObject;

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'openMrsApi',
						{
							method: 'POST',
							url: `${baseUrl}/ws/fhir2/R4/Encounter`,
							body,
							json: true,
						},
					);

					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
					continue;
				}

				// ----------------------------------------------------------------
				// Get by UUID
				// ----------------------------------------------------------------
				if (operation === 'get') {
					const idParam = resourceIdParamMap[resource];
					const resourceId = this.getNodeParameter(idParam, i) as string;
					const fhirResource = fhirResourceMap[resource];
					endpoint = `/ws/fhir2/R4/${fhirResource}/${resourceId}`;
				}

				// ----------------------------------------------------------------
				// Search operations (Patient only)
				// ----------------------------------------------------------------
				else if (operation === 'searchByIdentifier') {
					const identifier = this.getNodeParameter('identifier', i) as string;
					endpoint = '/ws/fhir2/R4/Patient';
					qs.identifier = identifier;
					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					if (!returnAll) qs._count = this.getNodeParameter('limit', i, 50) as number;
				}
				else if (operation === 'searchByName') {
					const name = this.getNodeParameter('name', i) as string;
					endpoint = '/ws/fhir2/R4/Patient';
					qs.name = name;
					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					if (!returnAll) qs._count = this.getNodeParameter('limit', i, 50) as number;
				}
				else if (operation === 'searchByPhone') {
					const phone = this.getNodeParameter('phone', i) as string;
					endpoint = '/ws/fhir2/R4/Patient';
					qs.telecom = phone;
					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					if (!returnAll) qs._count = this.getNodeParameter('limit', i, 50) as number;
				}

				// ----------------------------------------------------------------
				// Get Many
				// ----------------------------------------------------------------
				else if (operation === 'getAll') {
					const fhirResource = fhirResourceMap[resource];
					endpoint = `/ws/fhir2/R4/${fhirResource}`;

					if (resource !== 'patient') {
						qs.patient = this.getNodeParameter('patientIdFilter', i) as string;
					}

					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					if (!returnAll) qs._count = this.getNodeParameter('limit', i) as number;
				}

				// ----------------------------------------------------------------
				// Shared GET handler
				// ----------------------------------------------------------------
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'openMrsApi',
					{
						method: 'GET',
						url: `${baseUrl}${endpoint}`,
						qs,
						json: true,
					},
				);

				if (Array.isArray(response)) {
					returnData.push(
						...response.map((item: IDataObject) => ({ json: item, pairedItem: { item: i } })),
					);
				} else if (response.entry) {
					const entries = response.entry as Array<{ resource: IDataObject }>;
					if (entries.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'No results found for the search criteria',
							{ itemIndex: i },
						);
					}
					returnData.push(
						...entries.map((entry) => ({ json: entry.resource, pairedItem: { item: i } })),
					);
				} else {
					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : 'Unknown error' },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : new Error(String(error)),
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}