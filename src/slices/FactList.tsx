// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { assignTo, FactList, ThemeMods } from '@blateral/b.kit';
import { BgMode, ModxImageMetaData, ModxSlice } from 'utils/modx';

interface FactListEntryItems {
    title?: string;
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
    bgColor?: string;
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
    theme?: ThemeMods;
}

export const FactListSlice: React.FC<FactListSliceType> = ({
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
        <FactList
            theme={sliceTheme}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            facts={items?.map((item) => {
                return {
                    label: item.title,
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
