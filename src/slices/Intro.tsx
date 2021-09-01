import { Intro } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import {
    isExternalLink,
    isHeadlineTag,
    isValidAction,
    ModxSlice,
} from 'utils/modx';
import { HeadlineTagDefault } from 'utils/stringLexicon';

type BgMode = 'full' | 'splitted' | 'inverted';

export interface IntroSliceType extends ModxSlice<'Intro'> {
    isActive?: boolean;

    bgMode?: BgMode;
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
}

export const IntroSlice: React.FC<IntroSliceType> = ({
    isCentered,
    isStackable,
    bgMode,
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
}) => {
    return (
        <Intro
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
