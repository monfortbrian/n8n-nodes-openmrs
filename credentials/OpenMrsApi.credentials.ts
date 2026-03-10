import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OpenMrsApi implements ICredentialType {
	name = 'openMrsApi';
	displayName = 'OpenMRS API';
	icon = { light: 'file:openMrs.svg', dark: 'file:openMrs.svg' } as const;
	documentationUrl = 'https://wiki.openmrs.org/display/projects/FHIR+Module';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://demo.openmrs.org/openmrs',
			placeholder: 'https://demo.openmrs.org/openmrs',
			description: 'The base URL of your OpenMRS instance (include /openmrs path)',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'admin',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
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
			url: '/ws/rest/v1/session',
		},
	};
}