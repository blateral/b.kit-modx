import React from 'react';
import { ParallaxBackground } from '@blateral/b.kit';
import { ModxSlice } from '../utils/modx';

export interface ParallaxBackgroundSliceType extends ModxSlice<'ParallaxBackground'> {
    isActive?: boolean;
    image?: string;
}

export const ParallaxBackgroundSlice: React.FC<ParallaxBackgroundSliceType> = ({
    image,
}) => {
    if (!image) return null;
    return <ParallaxBackground image={<img src={`${image}`} />} />;
};