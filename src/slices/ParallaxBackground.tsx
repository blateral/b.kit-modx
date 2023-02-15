import React, { lazy } from 'react';
import {
    ModxConnectorConfig,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { isSVG } from 'utils/mapping';
import { ParallaxWidth } from '@blateral/b.kit/types/components/sections/ParallaxBackground';

const ParallaxBackground = lazy(() => import('imports/ParallaxBackground'));

export interface ParallaxBackgroundSliceType
    extends ModxSlice<'ParallaxBackground'> {
    isActive?: boolean;
    image?: ModxImagePropsWithFormat | string;
    hAlign?: 'left' | 'center' | 'right';
    format?: 'landscape' | 'square' | 'portrait';
    contentWidth?: ParallaxWidth;
}

export const ParallaxBackgroundSlice: React.FC<ParallaxBackgroundSliceType> = ({
    image,
    hAlign,
    format,
    contentWidth,
    config,
}) => {
    return (
        <ParallaxBackground
            contentWidth={contentWidth}
            hAlign={hAlign || 'left'}
            image={
                image
                    ? isString(image)
                        ? {
                              small: image,
                          }
                        : imageToImageProps(image, format, config)
                    : undefined
            }
        />
    );
};

const imageToImageProps = (
    image: ModxImagePropsWithFormat | string,
    format = 'square',
    config: ModxConnectorConfig
) => {
    const imageProps = isSVG(image[format || 'square']?.small)
        ? {
              small: `${config?.endpoint + image[format || 'square']?.small}`,
          }
        : image[format || 'square'];

    return imageProps;
};

// Legacy Support
const isString = (image?: ModxImagePropsWithFormat | string) => {
    return typeof image === 'string';
};
