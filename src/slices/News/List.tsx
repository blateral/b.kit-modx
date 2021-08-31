import { NewsList } from '@blateral/b.kit';
import React from 'react';
import { BgMode, isExternalLink, ModxNewsPage, ModxSlice } from 'utils/modx';

export interface NewsListSliceType extends ModxSlice<'NewsList', ModxNewsPage> {
    primary: {
        isActive?: boolean;
        showMoreText?: string;
        bgMode?: BgMode;
    };
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (name: string) => void;
}

export const NewsListSlice: React.FC<NewsListSliceType> = ({
    primary: { showMoreText, bgMode },
    items,
    cardAction,
    onTagClick,
}) => {
    // get background mode
    const newsListMap = mapNewsListData({
        newsCollection: items,
        cardAction,
        onTagClick,
    });

    return (
        <NewsList
            showMoreText={showMoreText}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            news={newsListMap}
        />
    );
};
function mapNewsListData({
    newsCollection,
    cardAction,
    onTagClick,
}: {
    newsCollection: ModxNewsPage[] | undefined;
    cardAction?: (props: {
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

        return {
            image: {
                ...news.news_image_preview,
                small: news.news_image_preview?.small || '',
                alt: news.news_image_preview?.meta?.altText || '',
            },
            tag: news.news_tags ? news.news_tags.split(',')[0] : '',
            publishDate: publicationDate,
            title: (news?.news_heading && news.news_heading) || '',
            text: news.news_intro && news.news_intro,

            link: { href: `/news/${news.id}`, isExternal: false },
            secondaryAction: (isInverted: boolean) =>
                cardAction &&
                cardAction({
                    isInverted,
                    label: 'Beitrag lesen',
                    href: `/news/${news.id}`,
                    isExternal: isExternalLink(news.secondary_link),
                }),
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
        console.error('Error in NewsIntro date generation. \n', e);
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
