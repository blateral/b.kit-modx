import { ComparisonSlider } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import {
    BgMode,
    ModxImageMetaData,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';

export interface ComparisonSliderSliceType
    extends ModxSlice<'ComparisonSlider'> {
    primary: {
        isActive?: boolean;

        bgMode?: BgMode;
        hasAnim?: boolean;
        foregroundImage?: ModxImageProps & ModxImageMetaData;
        backgroundImage?: ModxImageProps & ModxImageMetaData;
        foregroundLabel?: string;
        backgroundLabel?: string;
    };
    // helpers to define component elements outside of slice
    initalValue?: number;
    overlayColor?: string;
    labelColor?: string;
    dragControl?: React.ReactNode;
}

export const ComparisonSliderSlice: React.FC<ComparisonSliderSliceType> = ({
    primary: {
        bgMode,
        hasAnim,
        foregroundImage,
        foregroundLabel,
        backgroundImage,
        backgroundLabel,
    },
    initalValue,
    overlayColor,
    labelColor,
    dragControl,
}) => {
    const mappedForegroundImage: ImageProps = {
        ...foregroundImage,
        small: foregroundImage?.small || '',
        alt: foregroundImage?.meta?.altText || '',
    };
    const mappedBackgroundImage: ImageProps = {
        ...backgroundImage,
        small: backgroundImage?.small || '',
        alt: backgroundImage?.meta?.altText || '',
    };

    return (
        <ComparisonSlider
            bgMode={bgMode}
            initialValue={initalValue}
            foregroundImg={mappedForegroundImage}
            backgroundImg={mappedBackgroundImage}
            foregroundLabel={foregroundLabel}
            backgroundLabel={backgroundLabel}
            overlayColor={overlayColor}
            labelColor={labelColor}
            dragControl={dragControl}
            enableControlAnim={hasAnim}
        />
    );
};
