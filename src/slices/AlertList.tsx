import { ModxSlice } from 'utils/modx';

import { AlertList, assignTo, ThemeMods } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'inverted';

interface AlertListItems {
    label?: string;
    description?: string;
    date?: string;
    link?: {
        href?: string;
        isExternal?: boolean;
    };
}

export interface AlertListSliceType
    extends ModxSlice<'AlertList', AlertListItems> {
    isActive?: boolean;

    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const AlertListSlice: React.FC<AlertListSliceType> = ({
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
        <AlertList
            theme={sliceTheme}
            bgMode={bgMode}
            items={items.map((alert) => {
                const dateParts = alert.date?.split('.') || [];

                let date = undefined;
                if (dateParts?.length > 0) {
                    date = new Date(
                        +dateParts[0],
                        +dateParts[1],
                        +dateParts[2]
                    );
                }
                return {
                    title: alert.label,
                    date: date,
                    description: alert.description,
                    link: alert.link,
                };
            })}
        />
    );
};