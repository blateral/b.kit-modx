import { Accordion, assignTo, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxSlice } from 'utils/modx';

interface AccordionItem {
    label: string;
    text?: string;
    aside?: string;
}

export interface AccordionSliceType extends ModxSlice<'Accordion', AccordionItem> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;
    theme?: ThemeMods;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    bgMode,
    anchor,
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
            anchorId={anchor?.id || ''}
            items={items.map((item) => {
                return {
                    label: item.label,
                    text: item.text,
                    aside: item.aside,
                };
            })}
            bgMode={
                bgMode === 'inverted' || bgMode === 'full'
                    ? (bgMode as 'full' | 'inverted')
                    : undefined
            }
        />
    );
};
