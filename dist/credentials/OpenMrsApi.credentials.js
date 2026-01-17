'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.OpenMrsApi = void 0;
class OpenMrsApi {
  constructor() {
    this.name = 'openMrsApi';
    this.displayName = 'OpenMRS API';
    this.documentationUrl = 'https://wiki.openmrs.org/display/docs/REST+API';
    this.properties = [
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://demo.openmrs.org/openmrs',
        placeholder: 'https://demo.openmrs.org/openmrs',
        description: 'The base URL of OpenMRS instance',
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
    this.authenticate = {
      type: 'generic',
      properties: {
        auth: {
          username: '={{$credentials.username}}',
          password: '={{$credentials.password}}',
        },
      },
    };
    this.test = {
      request: {
        baseURL: '={{$credentials.baseUrl}}',
        url: '/ws/fhir2/R4/metadata',
        method: 'GET',
      },
    };
  }
}
exports.OpenMrsApi = OpenMrsApi;
