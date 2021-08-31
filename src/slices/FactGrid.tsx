// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { FactGrid } from '@blateral/b.kit';
import { BgMode, ModxImagePropsWithFormat, ModxSlice } from 'utils/modx';
import { isSVG } from 'utils/mapping';
interface FactGridEntryItems {
    title?: string;
    sub_title?: string;
    text?: string;
    icon?: Omit<ModxImagePropsWithFormat, 'portrait' | 'square'>;
}

export interface FactGridSliceType
    extends ModxSlice<'FactGrid', FactGridEntryItems> {
    primary: {
        isActive?: boolean;

        isCentered?: boolean;
        bgMode?: BgMode;
        imageFormat?: 'landscape-wide' | 'landscape';
        columns?: 3 | 4 | 6 | string;
    };
}

export const FactGridSlice: React.FC<FactGridSliceType> = ({
    primary: { isCentered, bgMode, imageFormat, columns },
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
            facts={items?.map(({ title, sub_title, text, icon }) => {
                const isSvgImage =
                    isSVG(icon?.landscape?.small) ||
                    isSVG(icon?.['landscape-wide']?.xlarge);

                return {
                    title: title,
                    subTitle: sub_title,
                    text: text,
                    image: icon && {
                        ...icon[imageFormat || 'landscape-wide'],
                        small:
                            icon[imageFormat || 'landscape-wide']?.small || '',
                        coverSpace: !isSvgImage,
                    },
                };
            })}
        />
    );
};
