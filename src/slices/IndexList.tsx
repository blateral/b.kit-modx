import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { IndexList } from '@blateral/b.kit/sections';
import { LinkProps } from '@blateral/b.kit/types/components/buttons/Button';
import { normalizeAnchorId } from 'utils/mapping';
import { ModxSlice } from 'utils/modx';

export interface IndexListItem {
    label?: string;
    link?: LinkProps;
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
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            theme={sliceTheme}
            items={items.filter(isValidIndexItem)}
            customIcon={customIcon}
        />
    );
};

const isValidIndexItem = (item: IndexListItem) =>
    Boolean(item) && item.label && item.link?.href;

export const createIndexListAnchor = (anchorId?: string) => {
    if (!anchorId) return {};
    return {
        label: anchorId,
        link: {
            href: `#${normalizeAnchorId(anchorId)}`,
        },
    };
};
