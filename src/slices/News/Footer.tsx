import { NewsFooter } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { isExternalLink, ModxNewsPage, ModxSlice } from 'utils/modx';

export interface NewsFooterSliceType
    extends ModxSlice<'NewsFooter', ModxNewsPage> {
    primary: {
        isActive?: boolean;
        isInverted?: boolean;
        newsFooterBackground?: boolean;
    };

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
    primary: { isInverted, newsFooterBackground },
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
    newsCollection: ModxNewsPage[] | undefined;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (name?: string) => void;
}) {
    if (!newsCollection) return [];

    return newsCollection.sort(byDateDescending).map((news) => {
        let publicationDate = undefined;
        try {
            publicationDate = news.publication_date
                ? generatePublicationDateObject(news.publication_date)
                : undefined;
        } catch {
            publicationDate = undefined;
        }

        const mappedImage: ImageProps = {
            ...news.news_image_preview,
            small: news.news_image_preview?.small || '',
            alt: news.news_image_preview?.meta?.altText || '',
        };
        return {
            image: mappedImage,
            tag: news?.news_tags?.split(',')[0],
            publishDate: publicationDate,
            title: (news?.news_heading && news.news_heading) || '',
            text: news.news_intro && news.news_intro,
            link: { href: `/news/${news.id}`, isExternal: false },

            secondaryAction: secondaryAction
                ? (isInverted: boolean) =>
                      secondaryAction({
                          isInverted,
                          label: 'Beitrag lesen',
                          href: `/news/${news.id}`,
                          isExternal: isExternalLink(news.secondary_link),
                      })
                : undefined,
            onTagClick: onTagClick || undefined,
        };
    });
}

function generatePublicationDateObject(publication_date?: string) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split('/').filter(Boolean);
    try {
        const dateParts = parts[0].split('-').filter(Boolean);

        const publicationDate = new Date(
            +dateParts[0],
            +dateParts[1] - 1,
            +dateParts[2]
        );

        return publicationDate;
    } catch (e) {
        console.error('Error in NewsFooter date generation. \n', e);
        return undefined;
    }
}
const byDateDescending = (a: ModxNewsPage, b: ModxNewsPage) => {
    if (!a.publicationDate || !b.publicationDate) return 0;
    if (a.publicationDate > b.publicationDate) return -1;
    if (a.publicationDate < b.publicationDate) return 1;

    return 0;
};

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
