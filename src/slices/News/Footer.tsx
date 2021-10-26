import { NewsFooter } from '@blateral/b.kit';
import React from 'react';
import { ModxNewsTeaser, ModxSlice } from 'utils/modx';

export interface NewsFooterSliceType
    extends ModxSlice<'NewsFooter', ModxNewsTeaser> {
    isActive?: boolean;
    isInverted?: boolean;
    newsFooterBackground?: boolean;

    // helpers to define component elements outside of slice
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    onTagClick?: (name?: string) => void;
}

export const NewsFooterSlice: React.FC<NewsFooterSliceType> = ({
    isInverted,
    newsFooterBackground,
    items,
    secondaryAction,
    onTagClick,
}) => {

    const newsListMap = mapNewsListData({
        newsCollection: items,
        cardAction: secondaryAction,
        onTagClick,
    });

    return (
        <NewsFooter
            news={newsListMap || []}
            bgMode={
                isInverted
                    ? 'inverted'
                    : newsFooterBackground
                    ? 'full'
                    : undefined
            }
            showMoreText={'mehr anzeigen'}
        />
    );
};
function mapNewsListData({
    newsCollection,
    cardAction,
    onTagClick,
}: {
    newsCollection: ModxNewsTeaser[] | undefined;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (name?: string) => void;
}) {
    if (!newsCollection) return [];

    return newsCollection.map((news) => {
        let publicationDate = undefined;
        try {
            publicationDate = news.publishedOn
                ? generatePublicationDate(news.publishedOn)
                : undefined;
        } catch {
            publicationDate = undefined;
        }

        const mappedImage = {
            ...news.intro?.image_preview,
            small: news.intro?.image_preview?.small || '',
            alt: news.intro?.image_preview?.meta?.altText || '',
        };
        return {
            image: mappedImage,
            tag: news?.tags?.split(',')[0] || '',
            publishDate: publicationDate,
            title: news?.label || '',
            text: news.intro?.text,
            link: { href: 'news/' + news.link, isExternal: false },

            secondaryAction:
                cardAction && news.link
                    ? (isInverted: boolean) =>
                          cardAction({
                              isInverted,
                              label: news.readMeLabel || 'Beitrag lesen',
                              href: 'news/' + news.link,
                              isExternal: false,
                          })
                    : undefined,
            onTagClick: onTagClick || undefined,
        };
    });
}

const generatePublicationDate = (
    publication_date?: string,
    first_publication_date?: string
) => {
    if (!publication_date && !first_publication_date) return undefined;
    try {
        return publication_date
            ? generatePublicationDateObject(publication_date)
            : first_publication_date
            ? new Date(first_publication_date)
            : undefined;
    } catch {
        console.error('Error whlie generating publication date for news');
        return undefined;
    }
};

function generatePublicationDateObject(publication_date?: string) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split(' ').filter(Boolean);
    try {
        const dateParts = parts[0].split('-').filter(Boolean);

        const publicationDate = new Date(
            +dateParts[0],
            +dateParts[1] - 1,
            +dateParts[2]
        );

        return publicationDate;
    } catch (e) {
        console.error('Error in NewsIntro date generation. \n', e);
        return undefined;
    }
}
