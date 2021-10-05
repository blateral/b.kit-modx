import { Accordion, assignTo, Theme } from '@blateral/b.kit';
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
    bgColor?: string;
    theme?: Theme;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    bgMode,
    items,
    bgColor,
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
        <Accordion
            theme={sliceTheme}
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
