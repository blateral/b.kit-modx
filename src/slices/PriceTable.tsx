import { PriceTable } from '@blateral/b.kit';
import React from 'react';
import { ModxSlice } from '../utils/modx';

interface PriceTableItem {
    text?: string;
    primary_link?: string;
    primary_label?: string;
}

export interface PriceTableSliceType
    extends ModxSlice<'PriceTable', PriceTableItem> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    primary_link?: string;
    primary_label?: string;
    action?: (isInverted?: boolean) => React.ReactNode;
}

export const PriceTableSlice: React.FC<PriceTableSliceType> = ({
    bgMode,
    items,
    action,
}) => {
    const filteredItems = items.filter(filterEmptyItems);
    if (filteredItems.length < 1) return null;

    return (
        <PriceTable
            bgMode={bgMode}
            items={filteredItems.map((item) => {
                return {
                    text: item.text,
                    action: action ? action : undefined,
                };
            })}
        />
    );
};

const filterEmptyItems = (item: PriceTableItem) => item.text;
