import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';
import { ModxImageProps, ModxSlice } from 'utils/modx';

const SimpleImage = lazy(() => import('imports/SimpleImage'));

export interface SimpleImageSliceType extends ModxSlice<'SimpleImage'> {
    isActive?: boolean;
    anchorId?: string;
    hAlign?: 'left' | 'center' | 'right';
    image?: ModxImageProps & { originals: { w: string; h: string } };
    isStackable?: boolean;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;

    theme?: ThemeMods;
}

export const SimpleImageSlice: React.FC<SimpleImageSliceType> = ({
    image,
    hAlign,
    anchorId,
    isStackable,
    bgMode,
    bgColor,
    theme,
}) => {
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

    let ratio: { w: number; h: number } | undefined = undefined;
    if (image?.originals?.w && image?.originals?.h) {
        ratio = {
            w: +image.originals.w,
            h: +image.originals.h,
        };
    }

    return (
        <SimpleImage
            theme={sliceTheme}
            bgMode={bgMode}
            isStackable={isStackable}
            hAlign={hAlign}
            anchorId={normalizeAnchorId(anchorId)}
            image={
                image?.small
                    ? {
                          ...image,
                          alt: image.meta?.altText,
                          copyright: image.meta?.copyright,
                          ratios: ratio
                              ? {
                                    small: ratio,
                                }
                              : undefined,
                      }
                    : undefined
            }
        />
    );
};
