import { BgMode, ModxImageProps, ModxSlice } from '../utils/modx';

import { assignTo, NumberList, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { normalizeAnchorId } from 'utils/mapping';

interface NumberListItem {
    icon?: Pick<ModxImageProps, 'small' | 'meta'>;
    listNumber?: string;
    label?: string;
}

export interface NumberListSliceType
    extends ModxSlice<'NumberList', NumberListItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const NumberListSlice: React.FC<NumberListSliceType> = ({
    bgMode,
    bgColor,
    anchorId,
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
        <NumberList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            items={items?.map((item) => {
                return {
                    number: item.listNumber || '',
                    label: item.label || '',
                    icon: {
                        src: item?.icon?.small ? `${item.icon.small}` : '',
                        alt: item?.icon?.meta?.altText || '',
                    },
                };
            })}
        />
    );
};
