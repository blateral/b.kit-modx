import * as React from 'react';

interface LdOrganizationData {
    '@type':
        | 'Organization'
        | 'Airline'
        | 'Consortium'
        | 'Corporation'
        | 'EducationalOrganization'
        | 'FundingScheme'
        | 'GovernmentOrganization'
        | 'LibrarySystem'
        | 'LocalBusiness'
        | 'MedicalOrganization'
        | 'NGO'
        | 'NewsMediaOrganization'
        | 'PerformingGroup'
        | 'Project'
        | 'ResearchOrganization'
        | 'SportsOrganization'
        | 'WorkersUnion';

    name: string;
    url: string;
    image?: Array<string>;
    sameAs?: Array<string>;
    geo?: {
        '@type': 'GeoCoordinates';
        latitude: number;
        longitude: number;
    };
    address: {
        '@type': 'PostalAddress';
        streetAddress: string;
        addressLocality: string;
        postalCode: string;
        addressCountry: string;
    };
    telephone?: string;
    email?: string;
}

export const LdOrganizationScript: React.FC<{ data: LdOrganizationData }> = ({
    data,
}) => {
    if (!data) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data),
            }}
        />
    );
};
