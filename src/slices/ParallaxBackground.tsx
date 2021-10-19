import React from 'react';
import { ParallaxBackground } from '@blateral/b.kit';
import { isNumeric, ModxSlice } from '../utils/modx';

export interface ParallaxBackgroundSliceType
    extends ModxSlice<'ParallaxBackground'> {
    isActive?: boolean;
    image?: string;
    hAlign?: 'left' | 'center' | 'right';
    contentWidth?: string;
}

export const ParallaxBackgroundSlice: React.FC<ParallaxBackgroundSliceType> = ({
    image,
    hAlign,
    contentWidth,
}) => {
    if (!image) return null;
    return (
        <ParallaxBackground
            // In %
            contentWidth={
                contentWidth && isNumeric(contentWidth)
                    ? +contentWidth / 100
                    : undefined
            }
            hAlign={hAlign || 'left'}
            image={image ? <img src={`${image}`} /> : false}
        />
    );
};

