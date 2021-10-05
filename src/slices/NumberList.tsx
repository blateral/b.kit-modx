import { BgMode, ModxImageProps, ModxSlice } from '../utils/modx';

import { assignTo, NumberList, Theme } from '@blateral/b.kit';
import React from 'react';

interface NumberListItem {
    icon?: Pick<ModxImageProps, 'small' | 'meta'>;
    listNumber?: string;
    label?: string;
}

export interface NumberListSliceType
    extends ModxSlice<'NumberList', NumberListItem> {
    isActive?: boolean;
    bgMode?: BgMode;
    bgColor?: string;

    theme?: Theme;
}

export const NumberListSlice: React.FC<NumberListSliceType> = ({
    bgMode,
    bgColor,
    items,

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
        <NumberList
            theme={sliceTheme}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            items={items?.map((item) => {
                return {
                    number: item.listNumber || '',
                    label: item.label || '',
                    icon: {
                        src: item?.icon?.small || '',
                        alt: item?.icon?.meta?.altText || '',
                    },
                };
            })}
        />
    );
};
