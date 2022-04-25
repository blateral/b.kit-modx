import React from 'react';
import { assignTo, NewsVideo, ThemeMods } from '@blateral/b.kit';
import {
    isExternalLink,
    isValidAction,
    mapImageToComponentData,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';

export interface NewsVideoSliceType extends ModxSlice<'NewsVideo'> {
    isActive?: boolean;
    bgMode?: string;
    embedId?: string;
    image?: ModxImageProps;
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

    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsVideoSlice: React.FC<NewsVideoSliceType> = ({
    bgMode,
    embedId,
    image,
    primary_link,
    primary_label,
    secondary_link,
    secondary_label,
    primaryAction,
    secondaryAction,
    bgColor,
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
        <NewsVideo
            theme={sliceTheme}
            embedId={embedId || ''}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            bgImage={mapImageToComponentData(image)}
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
