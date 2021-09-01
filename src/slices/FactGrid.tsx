// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { FactGrid } from '@blateral/b.kit';
import { BgMode, ModxImagePropsWithFormat, ModxSlice } from 'utils/modx';
import { isSVG } from 'utils/mapping';
interface FactGridEntryItems {
    title?: string;
    subTitle?: string;
    text?: string;
    image?: Omit<ModxImagePropsWithFormat, 'portrait' | 'square'>;
}

export interface FactGridSliceType
    extends ModxSlice<'FactGrid', FactGridEntryItems> {
    isActive?: boolean;

    isCentered?: boolean;
    bgMode?: BgMode;
    imageFormat?: 'landscape-wide' | 'landscape';
    columns?: 3 | 4 | 6 | string;
}

export const FactGridSlice: React.FC<FactGridSliceType> = ({
    isCentered,
    bgMode,
    imageFormat,
    columns,
    items,
}) => {
    return (
        <FactGrid
            isCentered={isCentered}
            bgMode={bgMode}
            columns={
                columns && typeof columns === 'number'
                    ? columns
                    : (parseInt(columns || '3') as 3 | 4 | 6)
            }
            facts={items?.map(({ title, subTitle, text, image }) => {
                const isSvgImage =
                    isSVG(image?.landscape?.small) ||
                    isSVG(image?.['landscape-wide']?.xlarge);

                return {
                    title: title,
                    subTitle: subTitle,
                    text: text,
                    image: image && {
                        ...image[imageFormat || 'landscape-wide'],
                        small:
                            image[imageFormat || 'landscape-wide']?.small || '',
                        coverSpace: !isSvgImage,
                    },
                };
            })}
        />
    );
};
