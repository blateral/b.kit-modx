// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { assignTo, FactGrid, ThemeMods } from '@blateral/b.kit';
import {
    BgMode,
    // endpoint,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { isSVG } from 'utils/mapping';
interface FactGridEntryItems {
    title?: string;
    text?: string;
    image?: Omit<ModxImagePropsWithFormat, 'portrait' | 'square'>;
}

export interface FactGridSliceType extends ModxSlice<'FactGrid', FactGridEntryItems> {
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

    return (
        <FactGrid
            theme={sliceTheme}
            anchorId={anchorId || ''}
            isCentered={isCentered}
            bgMode={bgMode}
            columns={
                columns && typeof columns === 'number'
                    ? columns
                    : (parseInt(columns || '3') as 3 | 4 | 6)
            }
            facts={items?.map(({ title, text, image }) => {
                const isSvgImage =
                    isSVG(image?.landscape?.small) ||
                    isSVG(image?.['landscape-wide']?.xlarge);

                const completeImage = image && {
                    ...image[imageFormat || 'landscape-wide'],
                    small: image[imageFormat || 'landscape-wide']?.small || '',
                    coverSpace: !isSvgImage,
                };

                // if (isSvgImage) {
                //     completeImage = image && {
                //         small: `${endpoint}${
                //             image[imageFormat || 'landscape-wide']?.small || ''
                //         }`,
                //         medium: `${endpoint}${
                //             image[imageFormat || 'landscape-wide']?.medium || ''
                //         }`,
                //         semilarge: `${endpoint}${
                //             image[imageFormat || 'landscape-wide']?.semilarge ||
                //             ''
                //         }`,
                //         large: `${endpoint}${
                //             image[imageFormat || 'landscape-wide']?.large || ''
                //         }`,
                //         xlarge: `${endpoint}${
                //             image[imageFormat || 'landscape-wide']?.xlarge || ''
                //         }`,
                //         coverSpace: !isSvgImage,
                //     };
                // }

                return {
                    title: title,
                    text: text,
                    image: completeImage,
                };
            })}
        />
    );
};
