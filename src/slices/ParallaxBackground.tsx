import React from 'react';
import { ParallaxBackground } from '@blateral/b.kit';
import {
    endpoint,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { isSVG } from 'utils/mapping';
import { ParallaxWidth } from '@blateral/b.kit/lib/components/sections/ParallaxBackground';

export interface ParallaxBackgroundSliceType
    extends ModxSlice<'ParallaxBackground'> {
    isActive?: boolean;
    image?: ModxImagePropsWithFormat;
    hAlign?: 'left' | 'center' | 'right';
    format?: 'landscape' | 'square' | 'portrait';
    contentWidth?: ParallaxWidth;
}

export const ParallaxBackgroundSlice: React.FC<ParallaxBackgroundSliceType> = ({
    image,
    hAlign,
    format,
    contentWidth,
}) => {
    if (!image) return null;
    return (
        <ParallaxBackground
            // TODO:  Josef, Akasol
            contentWidth={contentWidth}
            hAlign={hAlign || 'left'}
            image={
                isSVG(image[format || 'square']?.small)
                    ? {
                          small: `${
                              endpoint + image[format || 'square']?.small
                          }`,
                      }
                    : image[format || 'square']
            }
        />
    );
};
