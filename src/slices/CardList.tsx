import { assignTo, CardList, ThemeMods } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { CardProps } from '@blateral/b.kit/lib/components/sections/CardList';
import React from 'react';
import { BgMode, ModxImageMetaData, ModxSlice } from 'utils/modx';

interface CardListItems {
    title?: string;
    subLabel?: string;
    icon?: string;
    link?: { href?: string; isExternal?: boolean };
    image?: ImageProps & ModxImageMetaData;
    cardColor?: string;
}

export interface CardListSliceType
    extends ModxSlice<'CardList', CardListItems> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;
    decorator?: (props: {
        isInverted?: boolean | undefined;
        icon?: string;
    }) => React.ReactNode;
    customIcon?: (props: {
        isInverted?: boolean | undefined;
        icon?: string;
    }) => React.ReactNode;

    theme?: ThemeMods;
}

export const CardListSlice: React.FC<CardListSliceType> = ({
    bgMode,
    bgColor,
    anchor,
    items,
    decorator,
    customIcon,
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
        <CardList
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={bgMode as 'full' | 'inverted' | undefined}
            items={items.map(
                (item): Omit<CardProps, 'decorator' | 'isInverted'> => {
                    return {
                        ...item,
                        customIcon:
                            customIcon && item.icon
                                ? ({ isInverted }) =>
                                      customIcon({
                                          isInverted,
                                          icon: item.icon,
                                      })
                                : undefined,
                    };
                }
            )}
        />
    );
};
