import React from 'react';
import { assignTo, PriceList, ThemeMods } from '@blateral/b.kit';
import { ModxSlice } from '../utils/modx';

interface PriceListItem {
    text?: string;
    price?: string;
}

export interface PriceListSliceType extends ModxSlice<'PriceList', PriceListItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: 'full' | 'inverted';
    theme?: ThemeMods;
    bgColor?: string;
}

export const PriceListSlice: React.FC<PriceListSliceType> = ({
    bgMode,
    anchorId,
    items,
    theme,
    bgColor,
}) => {
    const filteredItems = items.filter(filterEmptyItems);
    if (filteredItems.length < 1) return null;

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
        <PriceList
            bgMode={bgMode}
            anchorId={anchorId || ''}
            items={filteredItems}
            theme={sliceTheme}
        />
    );
};

const filterEmptyItems = (item: PriceListItem) => item.text;
