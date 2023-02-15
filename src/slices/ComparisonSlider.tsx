import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import {
    BgMode,
    ModxImageMetaData,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/types/components/blocks/Image';

const ComparisonSlider = lazy(() => import('imports/ComparisonSlider'));

export interface ComparisonSliderSliceType
    extends ModxSlice<'ComparisonSlider'> {
    isActive?: boolean;
    anchorId?: string;
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

    theme?: ThemeMods;
}

export const ComparisonSliderSlice: React.FC<ComparisonSliderSliceType> = ({
    bgMode,
    anchorId,
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
                sectionBg: {
                    medium: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <ComparisonSlider
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
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
