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
			// Resource Selection
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

			// Patient Operations (with search)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['patient'],
					},
				},
				options: [
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

			// Other Resources Operations (no search)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'encounter',
							'observation',
							'diagnosticReport',
							'condition',
							'medicationStatement',
						],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a resource by ID',
						action: 'Get a resource',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many resources',
						action: 'Get many resources',
					},
				],
				default: 'get',
			},

			// Custom API Call Operation
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customApiCall'],
					},
				},
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

			// Search Parameters
			{
				displayName: 'Identifier',
				name: 'identifier',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['patient'],
						operation: ['searchByIdentifier'],
					},
				},
				default: '',
				placeholder: '131280865',
				description: 'OpenMRS ID or National ID (e.g., 131280865)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['patient'],
						operation: ['searchByName'],
					},
				},
				default: '',
				placeholder: 'Patricia Lewis',
				description: 'Patient name (supports partial matching)',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['patient'],
						operation: ['searchByPhone'],
					},
				},
				default: '',
				placeholder: '+254712345678',
				description: 'Phone number in any format',
			},

			// UUID Parameters for Get operations
			{
				displayName: 'Patient ID',
				name: 'patientId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['patient'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The UUID of the patient',
			},
			{
				displayName: 'Encounter ID',
				name: 'encounterId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['encounter'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The UUID of the encounter',
			},
			{
				displayName: 'Observation ID',
				name: 'observationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['observation'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The UUID of the observation',
			},
			{
				displayName: 'Diagnostic Report ID',
				name: 'diagnosticReportId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['diagnosticReport'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The UUID of the diagnostic report',
			},
			{
				displayName: 'Condition ID',
				name: 'conditionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['condition'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The UUID of the condition',
			},
			{
				displayName: 'Medication Statement ID',
				name: 'medicationStatementId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['medicationStatement'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The UUID of the medication statement',
			},

			// Custom API Call Parameters
			{
				displayName: 'HTTP Method',
				name: 'httpMethod',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['customApiCall'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['customApiCall'],
					},
				},
				default: '/ws/fhir2/R4/Patient',
				placeholder: '/ws/fhir2/R4/Patient',
				description: 'The API endpoint (e.g., /ws/fhir2/R4/Patient)',
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['customApiCall'],
					},
				},
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

			// Patient ID Filter for Get Many
			{
				displayName: 'Patient ID',
				name: 'patientIdFilter',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'encounter',
							'observation',
							'diagnosticReport',
							'condition',
							'medicationStatement',
						],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The UUID of the patient to filter results by',
			},

			// Pagination
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
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
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
		const baseUrl = credentials.baseUrl as string;

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

				// Custom API Call
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

				// Regular resources
				const fhirResource = fhirResourceMap[resource];

				// Get operation
				if (operation === 'get') {
					const idParam = resourceIdParamMap[resource];
					const resourceId = this.getNodeParameter(idParam, i) as string;
					endpoint = `/ws/fhir2/R4/${fhirResource}/${resourceId}`;
				}
				// Search by Identifier
				else if (operation === 'searchByIdentifier') {
					const identifier = this.getNodeParameter('identifier', i) as string;
					endpoint = `/ws/fhir2/R4/Patient`;
					qs.identifier = identifier;

					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					if (!returnAll) {
						qs._count = this.getNodeParameter('limit', i, 50) as number;
					}
				}
				// Search by Name
				else if (operation === 'searchByName') {
					const name = this.getNodeParameter('name', i) as string;
					endpoint = `/ws/fhir2/R4/Patient`;
					qs.name = name;

					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					if (!returnAll) {
						qs._count = this.getNodeParameter('limit', i, 50) as number;
					}
				}
				// Search by Phone
				else if (operation === 'searchByPhone') {
					const phone = this.getNodeParameter('phone', i) as string;
					endpoint = `/ws/fhir2/R4/Patient`;
					qs.telecom = phone;

					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					if (!returnAll) {
						qs._count = this.getNodeParameter('limit', i, 50) as number;
					}
				}
				// Get All operation
				else if (operation === 'getAll') {
					endpoint = `/ws/fhir2/R4/${fhirResource}`;

					if (resource !== 'patient') {
						const patientId = this.getNodeParameter('patientIdFilter', i) as string;
						qs.patient = patientId;
					}

					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					if (!returnAll) {
						qs._count = this.getNodeParameter('limit', i) as number;
					}
				}

				// Make HTTP request
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

				// Process response
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
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: errorMessage }, pairedItem: { item: i } });
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