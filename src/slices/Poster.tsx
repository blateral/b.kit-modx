import React from 'react';

import { assignTo, Poster, ThemeMods } from '@blateral/b.kit';
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
import { normalizeAnchorId } from 'utils/mapping';

export interface PosterSliceActionProps {
    isInverted?: boolean;
    label?: string;
    href?: string;
    isExternal?: boolean;
    isTextCentered?: boolean;
}

export interface PosterSliceType extends ModxSlice<'Poster'> {
    isActive?: boolean;
    anchorId?: string;
    isInverted?: boolean;
    image?: ModxImageProps;
    hasWrapper?: boolean;
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;
    text?: string;
    bgColor?: string;
    primary_label?: string;
    secondary_label?: string;
    primary_link?: string;
    secondary_link?: string;
    vCentered?: boolean;
    hCentered?: boolean;

    // helpers to define component elements outside of slice
    primaryAction?: (props: PosterSliceActionProps) => React.ReactNode;
    secondaryAction?: (props: PosterSliceActionProps) => React.ReactNode;
    theme?: ThemeMods;
}

export const PosterSlice: React.FC<PosterSliceType> = ({
    image,
    anchorId,
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
    vCentered,
    hCentered,
    primaryAction,
    secondaryAction,
    theme,
    bgColor,
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
        <Poster
            anchorId={normalizeAnchorId(anchorId)}
            theme={sliceTheme}
            width={hasWrapper ? 'content' : 'full'}
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
                    ? ({ isInverted, isTextCentered }) =>
                          primaryAction({
                              isInverted,
                              isTextCentered,
                              label: primary_label,
                              href: primary_link || '',
                              isExternal: isExternalLink(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? ({ isInverted, isTextCentered }) =>
                          secondaryAction({
                              isInverted,
                              isTextCentered,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
            verticallyCentered={vCentered}
            horizontallyCentered={hCentered}
        />
    );
};
