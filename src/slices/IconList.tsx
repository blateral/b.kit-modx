import { IconList } from '@blateral/b.kit';
import React from 'react';
import {
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';

interface IconListImages {
    image: ModxImageProps;
}


export interface IconListSliceType
    extends ModxSlice<'IconList', IconListImages> {
    isActive?: boolean;

    isCentered?: boolean;
    bgMode?: BgMode;
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

export const IconListSlice: React.FC<IconListSliceType> = ({
    bgMode,
    isCentered,
    primary_link,
    primary_label,
    secondary_link,
    secondary_label,
    items,
    primaryAction,
    secondaryAction,
}) => {
    return (
        <IconList
            isCentered={isCentered}
            bgMode={
                bgMode && (bgMode === 'full' || bgMode === 'inverted')
                    ? bgMode
                    : undefined
            }
            items={items.map((item) => {
                return {
                    src: item?.image?.small || '',
                    alt: item?.image?.meta?.altText || '',
                };
            })}
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
