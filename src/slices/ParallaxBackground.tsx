import React from 'react';
import { ParallaxBackground } from '@blateral/b.kit';
import { endpoint, ModxImageProps, ModxSlice } from 'utils/modx';
import { isSVG } from 'utils/mapping';
import { ParallaxWidth } from '@blateral/b.kit/lib/components/sections/ParallaxBackground';

export interface ParallaxBackgroundSliceType
    extends ModxSlice<'ParallaxBackground'> {
    isActive?: boolean;
    image?: ModxImageProps;
    hAlign?: 'left' | 'center' | 'right';
    contentWidth?: ParallaxWidth;
}

export const ParallaxBackgroundSlice: React.FC<ParallaxBackgroundSliceType> = ({
    image,
    hAlign,
    contentWidth,
}) => {
    if (!image) return null;
    return (
        <ParallaxBackground
            // TODO:  Josef, Akasol
            contentWidth={contentWidth}
            hAlign={hAlign || 'left'}
            // #TODO: Bilder umbauen
            image={
                isSVG(image.small)
                    ? {
                          small: `${endpoint + image.small}`,
                      }
                    : image
            }
        />
    );
};
