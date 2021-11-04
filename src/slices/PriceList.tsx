import React from 'react';
import { assignTo, PriceList, Theme } from '@blateral/b.kit';
import { ModxSlice } from '../utils/modx';

interface PriceListItem {
    text?: string;
    price?: string;
}

export interface PriceListSliceType
    extends ModxSlice<'PriceList', PriceListItem> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    theme?: Theme;
    bgColor?: string;
}

export const PriceListSlice: React.FC<PriceListSliceType> = ({
    bgMode,
    items,
    theme,
    bgColor,
}) => {
    const filteredItems = items.filter(filterEmptyItems);
    if (filteredItems.length < 1) return null;

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
        <PriceList bgMode={bgMode} items={filteredItems} theme={sliceTheme} />
    );
};

const filterEmptyItems = (item: PriceListItem) => item.text;
