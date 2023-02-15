// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { FactGrid } from '@blateral/b.kit/sections';
import {
    BgMode,
    ModxImageProps,
    // endpoint,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

import { isSVG } from 'utils/mapping';
interface FactGridEntryItems {
    title?: string;
    text?: string;
    image?: Omit<ModxImagePropsWithFormat, 'portrait' | 'square'>;
}

export interface FactGridSliceType
    extends ModxSlice<'FactGrid', FactGridEntryItems> {
    isActive?: boolean;
    anchorId?: string;
    isCentered?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
    imageFormat?: 'landscape-wide' | 'landscape';
    columns?: 3 | 4 | 6 | string;

    theme?: ThemeMods;
}

export const FactGridSlice: React.FC<FactGridSliceType> = ({
    isCentered,
    anchorId,
    bgMode,
    bgColor,
    imageFormat,
    columns,
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

    const aspectRatios = {
        landscape: { small: { w: 620, h: 465 } },
        'landscape-wide': { small: { w: 620, h: 310 } },
    };

    return (
        <FactGrid
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            isCentered={isCentered}
            bgMode={bgMode}
            columns={
                columns && typeof columns === 'number'
                    ? columns
                    : (parseInt(columns || '3') as 3 | 4 | 6)
            }
            facts={items?.map(({ title, text, image }) => {
                // check if image urls are path to SVG image
                const isSvgImage =
                    isSVG(image?.landscape?.small) ||
                    isSVG(image?.['landscape-wide']?.xlarge);

                const selectedAspect: {
                    small: { w: number; h: number };
                } = aspectRatios[imageFormat || 'landscape'];

                const completeImage: ModxImageProps & {
                    ratios?: {
                        small: {
                            w: number;
                            h: number;
                        };
                    };
                } = image && {
                    ...image[imageFormat || 'square'],
                    ratios: !isSvgImage ? selectedAspect : undefined,
                    coverSpace: !isSvgImage,
                };

                return {
                    title: title,
                    text: text,
                    image: completeImage,
                };
            })}
        />
    );
};
