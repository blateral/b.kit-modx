import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { isValidArray } from '@blateral/b.kit/lib/hooks';

import { ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const AlertList = React.lazy(() => import('imports/_AlertList'));

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
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const AlertListSlice: React.FC<AlertListSliceType> = ({
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
        <AlertList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            items={items
                .filter((alert) => alert.label && alert.link?.href)
                .map((alert) => {
                    const dateParts = alert.date?.split('.') || [];

                    let date = undefined;
                    if (dateParts?.length > 0) {
                        const year = +dateParts[2];
                        const month =
                            +dateParts[1] - 1 < 0 ? 0 : +dateParts[1] - 1;
                        const day = +dateParts[0];

                        date = new Date(year, month, day);
                    }
                    return {
                        title: alert.label,
                        date: isValidDate(date) ? date : undefined,
                        description: alert.description,
                        link: alert.link,
                    };
                })}
        />
    );
};

function isValidDate(dateInstance?: Date) {
    if (!dateInstance) return undefined;
    return dateInstance instanceof Date && !isNaN(dateInstance as any);
}

export const getAlertListSearchData = (slice: AlertListSliceType): string[] => {
    const data: string[] = [];
    if (isValidArray(slice?.items, false)) {
        for (const item of slice.items) {
            if (item.label) data.push(item.label);
            if (item.description) data.push(item.description);
        }
    }
    return data;
};
