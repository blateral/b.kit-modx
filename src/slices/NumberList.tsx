import React, { lazy } from 'react';
import { BgMode, ModxImageProps, ModxSlice } from '../utils/modx';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { isSVG, normalizeAnchorId } from 'utils/mapping';
import { NumberListCardProps } from '@blateral/b.kit/types/components/sections/NumberList';

const NumberList = lazy(() => import('imports/NumberList'));

interface NumberListItem {
    image?: Pick<ModxImageProps, 'small' | 'meta'>;
    listNumber?: string;
    label?: string;
    text?: string;
}

export interface NumberListSliceType
    extends ModxSlice<'NumberList', NumberListItem> {
    isActive?: boolean;
    anchorId?: string;
    isCentered?: boolean;
    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const NumberListSlice: React.FC<NumberListSliceType> = ({
    bgMode,
    bgColor,
    isCentered,
    anchorId,
    items,

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

    return (
        <NumberList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            isCentered={isCentered}
            items={items?.map<NumberListCardProps>((item) => {
                // check if image urls are path to SVG image
                const isSvgImage = isSVG(item.image?.small);

                return {
                    digit: item.listNumber || '',
                    label: item.label || '',
                    text: item.text || '',
                    image: item.image?.small
                        ? {
                              ...item.image,
                              ratios: !isSvgImage
                                  ? { small: { w: 440, h: 242 } }
                                  : undefined,
                              coverSpace: !isSvgImage,
                          }
                        : undefined,
                };
            })}
        />
    );
};
