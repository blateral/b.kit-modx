import { assignTo, PriceTable, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { ModxSlice } from '../utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

interface PriceTableItem {
    title?: string;
    superTitle?: string;

    text?: string;
    primary_link?: string;
    primary_label?: string;

    isHighlighted?: boolean;
}

export interface PriceTableSliceType
    extends ModxSlice<'PriceTable', PriceTableItem> {
    isActive?: boolean;
    anchorId?: string;
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
    theme?: ThemeMods;
}

export const PriceTableSlice: React.FC<PriceTableSliceType> = ({
    bgMode,
    anchorId,
    items,
    action,
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
        <PriceTable
            bgMode={bgMode}
            anchorId={normalizeAnchorId(anchorId)}
            items={filteredItems.map((item) => {
                return {
                    title: item.title,
                    superTitle: item.superTitle,
                    hasBackground: !!bgMode,
                    isInverted: bgMode === 'inverted',
                    text: item.text,
                    isHighlighted: !!item.isHighlighted,
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
