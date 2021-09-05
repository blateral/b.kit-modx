import { NewsFooter } from '@blateral/b.kit';
import React from 'react';
import { isExternalLink, ModxNewsTeaser, ModxSlice } from 'utils/modx';

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
        secondaryAction,
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
    secondaryAction,
    onTagClick,
}: {
    newsCollection: ModxNewsTeaser[] | undefined;
    secondaryAction?: (props: {
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
                ? generatePublicationDateObject(news.publishedOn)
                : undefined;
        } catch {
            publicationDate = undefined;
        }

        const mappedImage = news?.intro?.image
            ? {
                  ...news.intro.image,
                  small: news.intro.image?.small || '',
                  alt: news.intro.image?.meta?.altText || '',
              }
            : undefined;

        return {
            image: mappedImage,
            tag: news?.tags?.split(',')[0] || '',
            publishDate: publicationDate,
            title: news?.intro?.title || '',
            text: news.intro?.intro,
            link: { href: news.link || '', isExternal: false },

            secondaryAction: secondaryAction
                ? (isInverted: boolean) =>
                      secondaryAction({
                          isInverted,
                          label: 'Beitrag lesen',
                          href: news.action.link,
                          isExternal: isExternalLink(news.action.link),
                      })
                : undefined,
            onTagClick: onTagClick || undefined,
        };
    });
}

function generatePublicationDateObject(publicationDate?: string) {
    if (!publicationDate) return undefined;

    const parts = publicationDate?.split(' ').filter(Boolean);
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

// const byDateDescending = (a: PrismicNewsPage, b: PrismicNewsPage) => {
//     let aDate: Date | undefined = new Date();
//     let bDate: Date | undefined = new Date();
//     if (a.data.publication_date && b.data.publication_date) {
//         aDate = generatePublicationDateObject(a.data.publication_date);
//         bDate = generatePublicationDateObject(b.data.publication_date);
//     } else if (!a.data.publication_date && b.data.publication_date) {
//         aDate = new Date(
//             a.first_publication_date || a.last_publication_date || ''
//         );
//         bDate = generatePublicationDateObject(b.data.publication_date);
//     } else if (a.data.publication_date && !b.data.publication_date) {
//         aDate = generatePublicationDateObject(a.data.publication_date);
//         bDate = new Date(
//             b.first_publication_date || b.last_publication_date || ''
//         );
//     } else if (!a.data.publication_date && !b.data.publication_date) {
//         aDate = new Date(
//             a.first_publication_date || a.last_publication_date || ''
//         );
//         bDate = new Date(
//             b.first_publication_date || b.last_publication_date || ''
//         );
//     } else {
//         return -1;
//     }

//     return (bDate as any) - (aDate as any);
// };
