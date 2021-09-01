// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { FactList } from '@blateral/b.kit';
import { BgMode, ModxImageMetaData, ModxSlice } from 'utils/modx';

interface FactListEntryItems {
    label?: string;
    text?: string;
    icon?: {
        url?: string;
        meta?: ModxImageMetaData;
    };
}

export interface FactListSliceType
    extends ModxSlice<'FactList', FactListEntryItems> {
    isActive?: boolean;
    bgMode?: BgMode;
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const FactListSlice: React.FC<FactListSliceType> = ({
    bgMode,
    items,
}) => {
    return (
        <FactList
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            facts={items?.map((item) => {
                return {
                    label: item.label,
                    text: item.text,
                    icon: {
                        src: item?.icon?.url || '',
                        alt: item?.icon?.meta?.altText || '',
                    },
                };
            })}
        />
    );
};
