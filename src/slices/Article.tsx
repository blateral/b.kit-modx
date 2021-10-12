import { Article, assignTo, Theme } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { BgMode, isExternalLink, isValidAction, ModxSlice } from 'utils/modx';

export interface ArticleSliceType extends ModxSlice<'Article'> {
    isActive?: boolean;
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;
    largeLeft?: boolean;
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
    theme?: Theme;
}

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    superTitle,
    superTitleAs,
    title,
    titleAs,
    largeLeft,
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
            bgMode={bgMode}
            title={title}
            titleAs={titleAs}
            halfAside={!largeLeft}
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
