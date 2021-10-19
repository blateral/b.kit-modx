import React from 'react';
import { ParallaxBackground } from '@blateral/b.kit';
import { ModxSlice } from '../utils/modx';

export interface ParallaxBackgroundSliceType
    extends ModxSlice<'ParallaxBackground'> {
    isActive?: boolean;
    image?: string;
    hAlign?: 'left' | 'center' | 'right';
    contentWidth?: number;
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
            contentWidth={contentWidth}
            hAlign={hAlign}
            image={image ? <img src={`${image}`} /> : false}
        />
    );
};
