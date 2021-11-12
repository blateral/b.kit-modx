import React from 'react';
import { ParallaxBackground } from '@blateral/b.kit';
import { endpoint, isNumeric, ModxSlice } from 'utils/modx';
import { isSVG } from 'utils/mapping';

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
            // #TODO: Neuer width type
            contentWidth={
                contentWidth && isNumeric(contentWidth)
                    ? +contentWidth / 100
                    : undefined
            }
            hAlign={hAlign || 'left'}
            // #TODO: Bilder umbauen
            image={{
                small: `${isSVG(image) ? endpoint + image : image}`,
            }}

            // image={
            //     image ? (
            //         <img src={`${isSVG(image) ? endpoint + image : image}`} />
            //     ) : (
            //         false
            //     )
            // }
        />
    );
};
