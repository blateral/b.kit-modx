import { assignTo, Navigation, ThemeMods } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { BgMode, isExternalLink, isValidAction, ModxSlice } from 'utils/modx';

export interface NavigationSliceType extends ModxSlice<'Navigation'> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgColor?: string;
    theme?: ThemeMods;
}

export const NavigationSlice: React.FC<NavigationSliceType> = ({
    anchor,
    bgColor,

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

    return <Navigation theme={sliceTheme} />;
};
