import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';
import { BgMode, isExternalLink, isValidAction, ModxSlice } from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/types/components/typography/Heading';

const Article = lazy(() => import('imports/Article'));

export interface ArticleSliceType extends ModxSlice<'Article'> {
    isActive?: boolean;
    anchorId?: string;
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;
    halfAside?: boolean;
    text?: string;
    asideText?: string;
    bgMode?: BgMode;
    bgColor?: string;
    primary_link?: string;
    secondary_link?: string;
    primary_label?: string;
    secondary_label?: string;
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    theme?: ThemeMods;
}

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    anchorId,
    superTitle,
    superTitleAs,
    title,
    titleAs,
    halfAside,
    text,
    asideText,
    bgMode,
    bgColor,
    primary_link,
    primary_label,
    secondary_link,
    secondary_label,
    primaryAction,
    secondaryAction,
    theme,
}) => {
    // merging cms and component theme settings
    const sliceTheme = assignTo(
        {
            colors: {
                sectionBg: {
                    medium: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <Article
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            title={title}
            titleAs={titleAs}
            titleSize={titleAs === 'h1' ? 'heading-1' : 'heading-2'}
            halfAside={halfAside}
            superTitle={superTitle}
            superTitleAs={superTitleAs}
            text={text}
            asideText={asideText}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: primary_label,
                              href: primary_link || '',
                              isExternal: isExternalLink(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
        />
    );
};

export const getArticleSearchData = (slice: ArticleSliceType): string[] => {
    const data: string[] = [];
    if (slice?.title) data.push(slice.title);
    if (slice?.text) data.push(slice.text);
    if (slice?.asideText) data.push(slice.asideText);
    return data;
};
