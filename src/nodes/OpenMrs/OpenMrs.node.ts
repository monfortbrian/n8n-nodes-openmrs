import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
} from 'n8n-workflow';

export class OpenMrs implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'OpenMRS',
    name: 'openMrs',
    icon: 'file:OpenMrs.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with OpenMRS FHIR API',
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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Patient',
            value: 'patient',
          },
          {
            name: 'Encounter',
            value: 'encounter',
          },
          {
            name: 'Observation',
            value: 'observation',
          },
          {
            name: 'Diagnostic Report',
            value: 'diagnosticReport',
          },
          {
            name: 'Condition',
            value: 'condition',
          },
          {
            name: 'Medication Statement',
            value: 'medicationStatement',
          },
        ],
        default: 'patient',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [
              'patient',
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
            name: 'Get All',
            value: 'getAll',
            description: 'Get all resources',
            action: 'Get all resources',
          },
        ],
        default: 'get',
      },
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
        description: 'UUID of the patient',
      },
      {
        displayName: 'Patient ID',
        name: 'patientId',
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
        description: 'UUID of the patient to filter by',
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
        description: 'UUID of the encounter',
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
        description: 'UUID of the condition',
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
        description: 'UUID of the medication statement',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            operation: ['getAll'],
          },
        },
        default: false,
        description:
          'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getAll'],
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
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('openMrsApi');
    const baseUrl = credentials.baseUrl as string;

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let endpoint = '';
        const qs: IDataObject = {};

        if (resource === 'patient') {
          if (operation === 'get') {
            const patientId = this.getNodeParameter('patientId', i) as string;
            endpoint = `/ws/fhir2/R4/Patient/${patientId}`;
          }
        }

        if (resource === 'encounter') {
          if (operation === 'get') {
            const encounterId = this.getNodeParameter(
              'encounterId',
              i,
            ) as string;
            endpoint = `/ws/fhir2/R4/Encounter/${encounterId}`;
          } else if (operation === 'getAll') {
            const patientId = this.getNodeParameter('patientId', i) as string;
            endpoint = '/ws/fhir2/R4/Encounter';
            qs.patient = patientId;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (!returnAll) {
              const limit = this.getNodeParameter('limit', i) as number;
              qs._count = limit;
            }
          }
        }

        if (resource === 'observation') {
          if (operation === 'getAll') {
            const patientId = this.getNodeParameter('patientId', i) as string;
            endpoint = '/ws/fhir2/R4/Observation';
            qs.patient = patientId;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (!returnAll) {
              const limit = this.getNodeParameter('limit', i) as number;
              qs._count = limit;
            }
          }
        }

        if (resource === 'diagnosticReport') {
          if (operation === 'getAll') {
            const patientId = this.getNodeParameter('patientId', i) as string;
            endpoint = '/ws/fhir2/R4/DiagnosticReport';
            qs.patient = patientId;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (!returnAll) {
              const limit = this.getNodeParameter('limit', i) as number;
              qs._count = limit;
            }
          }
        }

        if (resource === 'condition') {
          if (operation === 'get') {
            const conditionId = this.getNodeParameter(
              'conditionId',
              i,
            ) as string;
            endpoint = `/ws/fhir2/R4/Condition/${conditionId}`;
          } else if (operation === 'getAll') {
            const patientId = this.getNodeParameter('patientId', i) as string;
            endpoint = '/ws/fhir2/R4/Condition';
            qs.patient = patientId;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (!returnAll) {
              const limit = this.getNodeParameter('limit', i) as number;
              qs._count = limit;
            }
          }
        }

        if (resource === 'medicationStatement') {
          if (operation === 'get') {
            const medicationStatementId = this.getNodeParameter(
              'medicationStatementId',
              i,
            ) as string;
            endpoint = `/ws/fhir2/R4/MedicationStatement/${medicationStatementId}`;
          } else if (operation === 'getAll') {
            const patientId = this.getNodeParameter('patientId', i) as string;
            endpoint = '/ws/fhir2/R4/MedicationStatement';
            qs.patient = patientId;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (!returnAll) {
              const limit = this.getNodeParameter('limit', i) as number;
              qs._count = limit;
            }
          }
        }

        const options = {
          method: 'GET' as const,
          url: `${baseUrl}${endpoint}`,
          qs,
          json: true,
        };
        const responseData =
          await this.helpers.httpRequestWithAuthentication.call(
            this,
            'openMrsApi',
            options,
          );

        if (Array.isArray(responseData)) {
          returnData.push(...responseData.map((item) => ({ json: item })));
        } else if (responseData.entry) {
          // FHIR Bundle response
          returnData.push(
            ...responseData.entry.map((entry: any) => ({
              json: entry.resource,
            })),
          );
        } else {
          returnData.push({ json: responseData });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          returnData.push({ json: { error: errorMessage } });
          continue;
        }
        throw new NodeOperationError(
          this.getNode(),
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }

    return [returnData];
  }
}
