import React from 'react';

import {
    assignTo,
    FeatureCarousel,
    FeatureList,
    ThemeMods,
} from '@blateral/b.kit';
import { ResponsiveObject } from './slick';
import {
    BgMode,
    endpoint,
    isExternalLink,
    isValidAction,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { isSVG } from 'utils/mapping';
import { normalizeAnchorId } from 'utils/mapping';

interface FeatureItemType {
    title?: string;
    text?: string;

    description?: string;
    image: Omit<ModxImagePropsWithFormat, 'landscape-wide'>;

    primary_link?: string;
    secondary_link?: string;
    primary_label?: string;
    secondary_label?: string;
}

export interface FeatureListSliceType
    extends ModxSlice<'FeatureList', FeatureItemType> {
    isActive?: boolean;
    isCarousel?: boolean;
    anchorId?: string;
    isCentered?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
    imageFormat: 'square' | 'portrait' | 'landscape';

    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    controlNext?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    dot?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        index?: number;
    }) => React.ReactNode;
    beforeChange?: (props: { currentStep: number; nextStep: number }) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
    responsive?: ResponsiveObject[];
    theme?: ThemeMods;
}

export const FeatureListSlice: React.FC<FeatureListSliceType> = ({
    anchorId,
    isCarousel,
    isCentered,
    bgMode,
    bgColor,
    imageFormat,
    items,
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
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

    // get image format for all images
    const sharedProps = {
        isCentered,
        anchorId: normalizeAnchorId(anchorId),
        features: items
            .filter(filterMissingSmallFormat)
            .map(
                ({
                    title,
                    text,
                    description,
                    image,
                    primary_label,
                    primary_link,
                    secondary_label,
                    secondary_link,
                }) => {
                    // check if image urls are path to SVG image
                    const isSvgImage =
                        isSVG(image.landscape?.small) ||
                        isSVG(image.landscape?.small);

                    return {
                        title: title,
                        text: text,
                        description: description,
                        image: image[imageFormat]?.small
                            ? {
                                  small: `${isSvgImage ? endpoint : ''}${
                                      image[imageFormat]?.small
                                  }`,
                                  medium:
                                      `${isSvgImage ? endpoint : ''}${
                                          image[imageFormat]?.medium
                                      }` || '',
                                  large:
                                      `${isSvgImage ? endpoint : ''}${
                                          image[imageFormat]?.large
                                      }` || '',
                                  xlarge:
                                      `${isSvgImage ? endpoint : ''}${
                                          image[imageFormat]?.xlarge
                                      }` || '',

                                  alt: image.meta?.altText || '',
                                  coverSpace: !isSvgImage,
                              }
                            : undefined,
                        primaryAction:
                            primaryAction &&
                            isValidAction(primary_label, primary_link)
                                ? (isInverted: boolean) =>
                                      primaryAction({
                                          isInverted,
                                          label: primary_label,
                                          href: primary_link || '',
                                          isExternal:
                                              isExternalLink(primary_link),
                                      })
                                : undefined,
                        secondaryAction:
                            secondaryAction &&
                            isValidAction(secondary_label, secondary_link)
                                ? (isInverted: boolean) =>
                                      secondaryAction({
                                          isInverted,
                                          label: secondary_label,
                                          href: secondary_link || '',
                                          isExternal:
                                              isExternalLink(secondary_link),
                                      })
                                : undefined,
                    };
                }
            ),
    };

    if (isCarousel) {
        return (
            <FeatureCarousel
                {...sharedProps}
                theme={sliceTheme}
                bgMode={bgMode}
                controlNext={controlNext}
                controlPrev={controlPrev}
                beforeChange={beforeChange}
                afterChange={afterChange}
                onInit={onInit}
                dot={dot}
                slidesToShow={slidesToShow}
                responsive={responsive}
            />
        );
    } else {
        return (
            <FeatureList {...sharedProps} theme={sliceTheme} bgMode={bgMode} />
        );
    }
};

const filterMissingSmallFormat = (item: FeatureItemType) =>
    item.image.landscape?.small ||
    item.image.portrait?.small ||
    item.image.square?.small;
