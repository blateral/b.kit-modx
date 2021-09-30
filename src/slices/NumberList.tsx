import { BgMode, ModxImageProps, ModxSlice } from '../utils/modx';

import { NumberList } from '@blateral/b.kit';
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
}

export const NumberListSlice: React.FC<NumberListSliceType> = ({
    bgMode,
    items,
}) => {
    return (
        <NumberList
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            items={items?.map((item) => {
                return {
                    number: item.listNumber || '',
                    label: item.label || '',
                    icon: {
                        src: item?.icon?.small
                            ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${item.icon.small}`
                            : '',
                        alt: item?.icon?.meta?.altText || '',
                    },
                };
            })}
        />
    );
};
