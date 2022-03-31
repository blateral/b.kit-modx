import {
    ModxSlice,
    isExternalLink,
    isHeadlineTag,
    isValidAction,
} from 'utils/modx';

import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { HeadlineTagDefault } from 'utils/stringLexicon';
import { assignTo, Intro, ThemeMods } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'splitted' | 'inverted';

export interface IntroSliceType extends ModxSlice<'Intro'> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: BgMode;
    bgColor?: string;
    title?: string;
    titleAs?: string;
    superTitle?: string;
    superTitleAs?: string;
    text?: string;

    isCentered?: boolean;
    isStackable?: boolean;

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

export const IntroSlice: React.FC<IntroSliceType> = ({
    anchor,
    isCentered,
    isStackable,
    bgMode,
    bgColor,
    title,
    titleAs,
    superTitle,
    superTitleAs,
    text,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,

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
        <Intro
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            isStackable={isStackable}
            isCentered={isCentered}
            title={title || ''}
            superTitle={superTitle}
            superTitleAs={
                isHeadlineTag(superTitleAs)
                    ? (superTitleAs as HeadlineTag)
                    : HeadlineTagDefault
            }
            titleAs={
                isHeadlineTag(titleAs)
                    ? (titleAs as HeadlineTag)
                    : HeadlineTagDefault
            }
            text={text}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted: boolean) =>
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
                    ? (isInverted: boolean) =>
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
