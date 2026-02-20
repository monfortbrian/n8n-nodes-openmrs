import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OpenMrsApi implements ICredentialType {
  name = 'openMrsApi';
  displayName = 'OpenMRS API';
  documentationUrl = 'https://wiki.openmrs.org/display/docs/REST+API';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://your-openmrs-instance.org',
      placeholder: 'https://demo.openmrs.org/openmrs',
      description: 'The base URL of your OpenMRS instance',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'OpenMRS username',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'OpenMRS password',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/ws/fhir2/R4/metadata',
      method: 'GET',
    },
  };
}
