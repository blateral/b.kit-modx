import * as React from 'react';
import { ModxNewsPage } from './../utils/modx';
import { parseModxDateToObject } from './utils';
interface LdNewsArticleData {
    '@context': 'https://schema.org';
    '@type': 'NewsArticle';
    headline: string;
    image?: Array<string>;
    datePublished?: Date;
    dateModified?: Date;
    author?: Array<{
        '@type': 'Person';
        name: string;
        url: string;
    }>;
}

export const LdOrganizationScript: React.FC<{ page: ModxNewsPage }> = ({
    page,
}) => {
    if (!page || !page.newsHeading) return null;

    const data: LdNewsArticleData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: page.newsHeading || '',
        image: [page?.newsImage?.small || ''],
        datePublished: parseModxDateToObject(page?.publishedOn || ''),
        dateModified: parseModxDateToObject(page?.updatedAt || ''),
        // TODO: Add url to user profile for full data compataibility
        // author: [{
        //     "@type": "Person",
        //     name: page.author_name,
        //     url: ""
        // }]
    };
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data),
            }}
        />
    );
};
