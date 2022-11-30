import React from 'react';

import { SimpleImage } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';

import { ModxImageProps, ModxSlice } from 'utils/modx';
export interface SimpleImageSliceType extends ModxSlice<'SimpleImage'> {
    isActive?: boolean;
    anchorId?: string;
    hAlign?: 'left' | 'center' | 'right';
    image?: ModxImageProps & { originals: { w: string; h: string } };
}

export const SimpleImageSlice: React.FC<SimpleImageSliceType> = ({
    image,
    hAlign,
    anchorId,
}) => {
    let ratio: { w: number; h: number } | undefined = undefined;
    if (image?.originals.w && image?.originals.h) {
        ratio = {
            w: +image.originals.w,
            h: +image.originals.h,
        };
    }

    return (
        <SimpleImage
            hAlign={hAlign}
            anchorId={normalizeAnchorId(anchorId)}
            image={
                image?.small
                    ? {
                          ...image,
                          alt: image.meta?.altText,
                          copyright: image.meta?.copyright,
                          ratios: ratio
                              ? {
                                    small: ratio,
                                }
                              : undefined,
                      }
                    : undefined
            }
        />
    );
};
