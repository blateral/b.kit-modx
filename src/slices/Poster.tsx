import React from 'react';

import { Poster, ThemeMods } from '@blateral/b.kit';
import {
    isExternalLink,
    isHeadlineTag,
    isValidAction,
    mapImageToComponentData,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { HeadlineTagDefault } from 'utils/stringLexicon';
export interface PosterSliceType extends ModxSlice<'Poster'> {
    isActive?: boolean;
    isInverted?: boolean;
    image?: ModxImageProps;
    hasWrapper?: boolean;
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;
    text?: string;
    primary_label?: string;
    secondary_label?: string;
    primary_link?: string;
    secondary_link?: string;
    // helpers to define component elements outside of slice
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

export const PosterSlice: React.FC<PosterSliceType> = ({
    image,
    superTitle,
    superTitleAs,
    title,
    titleAs,
    text,
    primary_label,
    secondary_label,
    primary_link,
    secondary_link,
    hasWrapper,
    primaryAction,
    secondaryAction,
    theme,
}) => {
    return (
        <Poster
            theme={theme}
            hasWrapper={hasWrapper}
            image={mapImageToComponentData(image)}
            title={title}
            titleAs={
                isHeadlineTag(titleAs)
                    ? (titleAs as HeadlineTag)
                    : HeadlineTagDefault
            }
            superTitle={superTitle}
            superTitleAs={
                isHeadlineTag(superTitleAs)
                    ? (superTitleAs as HeadlineTag)
                    : HeadlineTagDefault
            }
            text={text}
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
