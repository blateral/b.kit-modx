import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { ModxSlice } from '../utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const PriceList = lazy(() => import('imports/PriceList'));

interface PriceListItem {
    text?: string;
    price?: string;
    title?: string;
}

export interface PriceListSliceType
    extends ModxSlice<'PriceList', PriceListItem> {
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
            anchorId={normalizeAnchorId(anchorId)}
            items={filteredItems}
            theme={sliceTheme}
        />
    );
};

const filterEmptyItems = (item: PriceListItem) => item.text;
