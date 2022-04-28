import { IndexList, assignTo, ThemeMods } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from 'utils/modx';

interface IndexListItem {
    id?: string;
    label?: string;
}

export interface IndexListSliceType
    extends ModxSlice<'IndexList', IndexListItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    customIcon?: (props: {
        isInverted?: boolean | undefined;
    }) => React.ReactNode;
    theme?: ThemeMods;
}

export const IndexListSlice: React.FC<IndexListSliceType> = ({
    bgMode,
    anchorId,
    bgColor,
    customIcon,
    items,
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
        <IndexList
            anchorId={anchorId || ''}
            bgMode={bgMode}
            theme={sliceTheme}
            items={items
                .filter(isValidIndexItem)
                .map(mapModxItemToComponentItem)}
            customIcon={customIcon}
        />
    );
};

const isValidIndexItem = (item: IndexListItem) =>
    Boolean(item) && item.id && item.label;

const mapModxItemToComponentItem = (item: IndexListItem) => {
    return {
        label: item.label || '',
        link: {
            href: `#${item.id}`,
        },
    };
};
