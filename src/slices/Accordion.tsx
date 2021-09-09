import { Accordion } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxSlice } from 'utils/modx';

interface AccordionItem {
    label: string;
    text?: string;
    hasColumns?: boolean;
}

export interface AccordionSliceType
    extends ModxSlice<'Accordion', AccordionItem> {
    isActive?: boolean;
    bgMode?: BgMode;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    bgMode,
    items,
}) => {
    return (
        <Accordion
            items={items.map((item) => {
                return {
                    label: item.label,
                    text: item.text,
                    hasColumns: item.hasColumns,
                };
            })}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
        />
    );
};
