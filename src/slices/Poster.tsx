import React from 'react';


import { Poster } from '@blateral/b.kit';
import {
    isHeadlineTag,
    isValidAction,
    ModxImageProps,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { HeadlineTagDefault } from 'utils/stringLexicon';

interface ImageFormats {
    landscape: string;
    'landscape-wide': string;
}
export interface PosterSliceType extends ModxSlice<'Poster'> {
    primary: {
        is_active?: boolean;

        image?: ModxImageProps;
        superTitle?: string;
        superTitleAs?: HeadlineTag;
        title?: string;
        titleAs?: HeadlineTag;
        text?: string;
        primary_label?: string;
        secondary_label?: string;
        primary_link?: string;
        secondary_link?: string;
    };
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
}

export const PosterSlice: React.FC<PosterSliceType> = ({
    primary: {
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
    },

    primaryAction,
    secondaryAction,
}) => {
    return (
        <Poster
            image={image}
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
                              href: resolveUnknownLink(primary_link) || '',
                              isExternal: isstringExternal(primary_link),
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
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isstringExternal(secondary_link),
                          })
                    : undefined
            }
        />
    );
};
