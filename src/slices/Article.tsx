import { Article, assignTo, ThemeMods } from '@blateral/b.kit';
import { LinkListProps } from '@blateral/b.kit/lib/components/blocks/LinkList';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { BgMode, isExternalLink, isValidAction, ModxSlice } from 'utils/modx';

export interface ArticleSliceType extends ModxSlice<'Article'> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;
    halfAside?: boolean;
    text?: string;
    asideText?: string;
    linkList?: LinkListProps;
    linkListAside?: LinkListProps;
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
    anchor,
    superTitle,
    superTitleAs,
    title,
    titleAs,
    halfAside,
    text,
    linkList,
    linkListAside,
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
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <Article
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            title={title}
            titleAs={titleAs}
            halfAside={halfAside}
            superTitle={superTitle}
            superTitleAs={superTitleAs}
            text={text}
            asideText={asideText}
            linkList={linkList}
            linkListAside={linkListAside}
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
