import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { Accordion } from '@blateral/b.kit/sections';
import { isValidArray } from '@blateral/b.kit/hooks';
import { BgMode, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

interface AccordionItem {
    label: string;
    text?: string;
    aside?: string;
}

export interface AccordionSliceType
    extends ModxSlice<'Accordion', AccordionItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;
    theme?: ThemeMods;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    bgMode,
    anchorId,
    items,
    bgColor,
    theme,
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
        <Accordion
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            items={items?.map((item) => ({
                label: item.label,
                text: item.text,
                aside: item.aside,
            }))}
            bgMode={
                bgMode === 'inverted' || bgMode === 'full'
                    ? (bgMode as 'full' | 'inverted')
                    : undefined
            }
        />
    );
};

export const getAccordionSearchData = (slice: AccordionSliceType): string[] => {
    const data: string[] = [];
    if (isValidArray(slice?.items, false)) {
        for (const item of slice.items) {
            if (item.label) data.push(item.label);
            if (item.text) data.push(item.text);
            if (item.aside) data.push(item.aside);
        }
    }
    return data;
};
