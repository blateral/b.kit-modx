import { assignTo, CardList, ThemeMods } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import React from 'react';
import { BgMode, ModxImageMetaData, ModxSlice } from 'utils/modx';

interface CardListItems {
    title?: string;
    subLabel?: string;
    icon?: { src?: string; meta?: ModxImageMetaData };
    link?: { href?: string; isExternal?: boolean };
    image?: ImageProps & ModxImageMetaData;
}

export interface CardListSliceType extends ModxSlice<'CardList', CardListItems> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;

    theme?: ThemeMods;
}

export const CardListSlice: React.FC<CardListSliceType> = ({
    bgMode,
    bgColor,
    anchor,
    items,
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
        <CardList
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={bgMode as 'full' | 'inverted' | undefined}
            items={items.map((item) => {
                return {
                    ...item,
                    icon: {
                        src: item.icon?.src || '',
                        alt: item.icon?.meta?.altText || '',
                    },
                };
            })}
        />
    );
};
