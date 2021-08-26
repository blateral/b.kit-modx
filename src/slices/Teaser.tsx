import { Teaser, TeaserWide } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { HeadlineTagDefault } from '../utils/stringLexicon';
import {
    isBgModeString,
    isExternalLink,
    isHeadlineTag,
    isValidAction,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';

export interface TeaserSliceType extends ModxSlice<'Teaser'> {
    primary: {
        isActive?: boolean;
        isMirrored?: boolean;
        isWide?: boolean;
        bgMode?: string;
        format?: string;
        superTitle?: string;
        superTitleAs?: HeadlineTag;
        title?: string;
        titleAs?: HeadlineTag;
        intro?: string;
        text?: string;
        subText?: string;
        image?: ModxImagePropsWithFormat;
        description?: string;

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

export const TeaserSlice: React.FC<TeaserSliceType> = ({
    primary: {
        isMirrored,
        isWide,
        bgMode,
        format,
        superTitle,
        superTitleAs,
        title,
        titleAs,
        intro,
        text,
        subText,
        image,
        description,

        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },

    primaryAction,
    secondaryAction,
}) => {
    const sharedProps = {
        isMirrored,
        superTitle,
        superTitleAs: superTitleAs,
        title: title,
        titleAs: titleAs,
        intro: intro,
        text: text,
        subText,
        image: image ? image[format || 'square'] : undefined,

        primaryAction:
            primaryAction && isValidAction(primary_label, primary_link)
                ? (isInverted: boolean) =>
                      primaryAction({
                          isInverted,
                          label: primary_label,
                          href: primary_link || '',
                          isExternal: isExternalLink(primary_link),
                      })
                : undefined,
        secondaryAction:
            secondaryAction && isValidAction(secondary_label, secondary_link)
                ? (isInverted: boolean) =>
                      secondaryAction({
                          isInverted,
                          label: secondary_label,
                          href: secondary_link || '',
                          isExternal: isExternalLink(secondary_link),
                      })
                : undefined,
    };

    if (isWide) {
        return (
            <TeaserWide
                {...sharedProps}
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
                // FIXME: Was hats mit diesem extra mapping auf sich?
                // bgMode={
                //     bgMode === 'full' || bgMode === 'inverted'
                //         ? bgMode
                //         : undefined
                // }

                bgMode={isBgModeString(bgMode) ? bgMode : undefined}
                image={{
                    ...image,
                    description: description,
                }}
            />
        );
    } else {
        return (
            <Teaser
                {...sharedProps}
                superTitleAs={
                    isHeadlineTag(superTitleAs)
                        ? superTitleAs
                        : HeadlineTagDefault
                }
                titleAs={
                    isHeadlineTag(titleAs)
                        ? (titleAs as HeadlineTag)
                        : HeadlineTagDefault
                }
                bgMode={isBgModeString(bgMode) ? bgMode : undefined}
            />
        );
    }
};
