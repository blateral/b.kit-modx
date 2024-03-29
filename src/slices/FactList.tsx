import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { BgMode, ModxImageMetaData, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const FactList = React.lazy(() => import('imports/_FactList'));

interface FactListEntryItems {
    title?: string;
    text?: string;
}

export interface FactListSliceType
    extends ModxSlice<'FactList', FactListEntryItems> {
    isActive?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
    anchorId?: string;
    icon?: {
        url?: string;
        meta?: ModxImageMetaData;
    };
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
    anchorId,
    items,
    icon,
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
        <FactList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            icon={
                icon?.url
                    ? {
                          src: icon.url,
                          alt: icon.meta?.altText || '',
                      }
                    : undefined
            }
            facts={items?.map((item) => {
                return {
                    label: item.title,
                    text: item.text,
                };
            })}
        />
    );
};
