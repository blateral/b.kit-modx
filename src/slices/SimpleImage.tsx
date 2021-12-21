import React from 'react';

import { SimpleImage } from '@blateral/b.kit';

import { ModxImageProps, ModxSlice } from 'utils/modx';
export interface SimpleImageSliceType extends ModxSlice<'SimpleImage'> {
    isActive?: boolean;
    hAlign?: 'left' | 'center' | 'right';
    image?: ModxImageProps;
}

export const SimpleImageSlice: React.FC<SimpleImageSliceType> = ({
    image,
    hAlign,
}) => {
    return (
        <SimpleImage hAlign={hAlign} image={image?.small ? image : undefined} />
    );
};
