import { assignTo, CardList, ThemeMods } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { CardProps } from '@blateral/b.kit/lib/components/sections/CardList';
import React from 'react';
import { BgMode, ModxImageMetaData, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

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
    anchorId?: string;
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;
    maxThreeCols?: boolean;
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
    anchorId,
    items,
    decorator,
    customIcon,
    theme,
    maxThreeCols,
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
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode as 'full' | 'inverted' | undefined}
            maxThreeCols={maxThreeCols}
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
