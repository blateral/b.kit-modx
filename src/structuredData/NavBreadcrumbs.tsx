import * as React from 'react';

interface LdBreadcrumbsData {
    '@context': 'https://schema.org';
    '@type': 'BreadcrumbList';
    itemListElement: Array<{
        '@type': 'ListItem';
        position: number;
        name: string;
        item: string;
    }>;
}

export const LdBreadcrumbsScript: React.FC<{ data: LdBreadcrumbsData }> = ({
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
