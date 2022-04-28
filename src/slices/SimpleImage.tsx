import React from 'react';

import { SimpleImage } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';

import { ModxImageProps, ModxSlice } from 'utils/modx';
export interface SimpleImageSliceType extends ModxSlice<'SimpleImage'> {
    isActive?: boolean;
    anchorId?: string;
    hAlign?: 'left' | 'center' | 'right';
    image?: ModxImageProps;
}

export const SimpleImageSlice: React.FC<SimpleImageSliceType> = ({
    image,
    hAlign,
    anchorId,
}) => {
    return (
        <SimpleImage
            hAlign={hAlign}
            anchorId={normalizeAnchorId(anchorId)}
            image={image?.small ? image : undefined}
        />
    );
};
