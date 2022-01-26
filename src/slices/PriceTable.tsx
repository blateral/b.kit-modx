import { assignTo, PriceTable, Theme } from '@blateral/b.kit';
import React from 'react';
import { ModxSlice } from '../utils/modx';

interface PriceTableItem {
    title?: string;
    superTitle?: string;

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
    action?: (props: {
        isHighlighted?: boolean;
        isInverted?: boolean;
        label?: string;
        href?: string;
    }) => React.ReactNode;
    theme?: Theme;
}

export const PriceTableSlice: React.FC<PriceTableSliceType> = ({
    bgMode,
    items,
    action,
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
        <PriceTable
            bgMode={bgMode}
            items={filteredItems.map((item) => {
                return {
                    title: item.title,
                    superTitle: item.superTitle,
                    hasBackground: !!bgMode,
                    isInverted: bgMode === 'inverted',
                    text: item.text,
                    action: action
                        ? ({ isInverted, isHighlighted }) =>
                              action({
                                  isInverted,
                                  isHighlighted,
                                  href: item.primary_link || '',
                                  label: item.primary_label,
                              })
                        : undefined,
                };
            })}
            theme={sliceTheme}
        />
    );
};

const filterEmptyItems = (item: PriceTableItem) => item.text;
