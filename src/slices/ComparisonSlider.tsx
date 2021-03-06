import { assignTo, ComparisonSlider, Theme } from '@blateral/b.kit';
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
    isActive?: boolean;

    bgMode?: BgMode;
    bgColor?: string;
    hasAnim?: boolean;
    foregroundImage?: ModxImageProps & ModxImageMetaData;
    backgroundImage?: ModxImageProps & ModxImageMetaData;
    foregroundLabel?: string;
    backgroundLabel?: string;
    // helpers to define component elements outside of slice
    initalValue?: number;
    overlayColor?: string;
    labelColor?: string;
    dragControl?: React.ReactNode;

    theme?: Theme;
}

export const ComparisonSliderSlice: React.FC<ComparisonSliderSliceType> = ({
    bgMode,
    bgColor,
    hasAnim,
    foregroundImage,
    foregroundLabel,
    backgroundImage,
    backgroundLabel,
    initalValue,
    overlayColor,
    labelColor,
    dragControl,
    theme,
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

    // merging cms and component theme settings
    const sliceTheme = assignTo(
        {
            colors: {
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <ComparisonSlider
            theme={sliceTheme}
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
