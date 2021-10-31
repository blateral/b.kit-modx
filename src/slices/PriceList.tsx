import React from 'react';
import { PriceList } from '@blateral/b.kit';
import { ModxSlice } from '../utils/modx';

interface PriceListItem {
    text?: string;
    price?: string;
}

export interface PriceListSliceType
    extends ModxSlice<'PriceList', PriceListItem> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
}

export const PriceListSlice: React.FC<PriceListSliceType> = ({
    bgMode,
    items,
}) => {
    const filteredItems = items.filter(filterEmptyItems);
    if (filteredItems.length < 1) return null;

    return <PriceList bgMode={bgMode} items={filteredItems} />;
};

const filterEmptyItems = (item: PriceListItem) => item.text;
