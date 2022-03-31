import React from 'react';

import { SimpleImage } from '@blateral/b.kit';

import { ModxImageProps, ModxSlice } from 'utils/modx';
export interface SimpleImageSliceType extends ModxSlice<'SimpleImage'> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    hAlign?: 'left' | 'center' | 'right';
    image?: ModxImageProps;
}

export const SimpleImageSlice: React.FC<SimpleImageSliceType> = ({
    image,
    hAlign,
    anchor,
}) => {
    return (
        <SimpleImage
            hAlign={hAlign}
            anchorId={anchor?.id || ''}
            image={image?.small ? image : undefined}
        />
    );
};
