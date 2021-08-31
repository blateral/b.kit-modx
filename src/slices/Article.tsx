import { Article } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { BgMode, isExternalLink, isValidAction, ModxSlice } from 'utils/modx';

export interface ArticleSliceType extends ModxSlice<'Article'> {
    primary: {
        isActive?: boolean;
        superTitle?: string;
        superTitleAs?: HeadlineTag;
        title?: string;
        titleAs?: HeadlineTag;

        text?: string;
        asideText?: string;
        bgMode?: BgMode;
        primary_link?: string;
        secondary_link?: string;
        primary_label?: string;
        secondary_label?: string;
    };
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
}

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    primary: {
        superTitle,
        superTitleAs,
        title,
        titleAs,
        text,
        asideText,
        bgMode,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <Article
            bgMode={bgMode}
            title={title}
            titleAs={titleAs}
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
