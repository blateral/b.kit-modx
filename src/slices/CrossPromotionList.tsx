import {
    assignTo,
    CrossPromotion,
    PromotionCarousel,
    Theme,
} from '@blateral/b.kit';

import { PromotionCardProps } from '@blateral/b.kit/lib/components/blocks/PromotionCard';
import React from 'react';
import {
    BgMode,
    isExternalLink,
    ModxImageMetaData,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { ResponsiveObject } from './slick';

interface CrossPromotionItems {
    isMain?: boolean;
    image?: {
        carousel: ModxImagePropsWithFormat;
        list: ModxImagePropsWithFormat;
        meta: ModxImageMetaData;
    };
    superTitle?: string;
    title?: string;
    link?: string;
}

type ImageFormats =
    | 'gallery-square'
    | 'gallery-portrait'
    | 'gallery-landscape'
    | 'gallery-triple-left'
    | 'gallery-triple-right'
    | 'carousel-square'
    | 'carousel-portrait'
    | 'carousel-big-portrait'
    | 'carousel-landscape'
    | 'landscape-wide';
export interface CrossPromotionListSliceType
    extends ModxSlice<'CrossPromotionList', CrossPromotionItems> {
    isActive?: boolean;
    isCarousel?: boolean;
    isMirrored?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
    externalLinkIcon?: React.ReactNode;
    imageFormat: ImageFormats;
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

    theme?: Theme;
}

export const CrossPromotionListSlice: React.FC<CrossPromotionListSliceType> = (
    props
) => {
    const { isCarousel } = props;

    if (isCarousel) {
        return createCPromoCarousel(props);
    } else {
        return createCPromoList(props);
    }
};

const createCPromoList = ({
    bgMode,
    bgColor,
    imageFormat,
    isMirrored,
    externalLinkIcon,
    items,
    theme,
}: CrossPromotionListSliceType) => {
    const promoItems: Array<CrossPromotionItems> = items;
    const isImagesMirrored =
        isMirrored || imageFormat === 'gallery-triple-right' ? true : false;

    let mainItems: PromotionCardProps[] | undefined = [];
    let asideItems: PromotionCardProps[] | undefined = [];

    const isFull = items?.length === 1 || imageFormat === 'landscape-wide';
    if (isFull) imageFormat = 'landscape-wide';

    if (imageFormat === 'gallery-triple-right') {
        const allImages = promoItems.map(mapTripleImageRight);
        mainItems = allImages.filter((item) => item.isMain);
        asideItems = allImages.filter((item) => !item.isMain);
    } else if (imageFormat === 'gallery-triple-left') {
        const allImages = promoItems.map(mapTripleImageLeft);
        mainItems = allImages.filter((item) => item.isMain);
        asideItems = allImages.filter((item) => !item.isMain);
    } else {
        const allImages = items.map((image, index, array) =>
            mapNonTripleGalleryImage(image, index, array, imageFormat, isFull)
        );

        mainItems = allImages.filter((image, index) => index % 2 === 0);
        asideItems = allImages.filter((image, index) => index % 2 !== 0);
    }

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
        <CrossPromotion
            externalLinkIcon={externalLinkIcon}
            theme={sliceTheme}
            isMirrored={isImagesMirrored}
            bgMode={bgMode}
            main={mainItems}
            aside={asideItems.length > 0 ? asideItems : undefined}
        />
    );
};

const createCPromoCarousel = ({
    bgMode,
    bgColor,
    imageFormat,

    items,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    externalLinkIcon,
    slidesToShow,
    responsive,
    theme,
}: CrossPromotionListSliceType) => {
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

    const mappedImageFormat = mapCarouselImageFormat(imageFormat);
    return (
        <PromotionCarousel
            theme={sliceTheme}
            bgMode={bgMode}
            promotions={items.map(({ image, superTitle, title, link }) => {
                const mappedImage = {
                    small: image?.carousel?.landscape?.small || '',
                    medium: image?.carousel[mappedImageFormat || 'square']
                        ?.medium,
                    semilarge:
                        image?.carousel[mappedImageFormat || 'square']
                            ?.semilarge,
                    large: image?.carousel[mappedImageFormat || 'square']
                        ?.large,
                    xlarge: image?.carousel[mappedImageFormat || 'square']
                        ?.xlarge,
                };

                return {
                    // href: link || undefined,
                    link: link
                        ? {
                              href: link,
                              isExternal: isExternalLink(link),
                          }
                        : undefined,
                    superTitle: superTitle,
                    title: title,
                    image: {
                        ...mappedImage,
                        alt: image?.meta.altText || '',
                        title: title,
                        href: link || undefined,
                    },
                };
            })}
            controlNext={controlNext}
            controlPrev={controlPrev}
            beforeChange={beforeChange}
            afterChange={afterChange}
            onInit={onInit}
            dot={dot}
            externalLinkIcon={externalLinkIcon}
            slidesToShow={slidesToShow}
            responsive={responsive}
        />
    );
};

function mapGalleryImageFormat(imageFormat: ImageFormats) {
    switch (imageFormat) {
        case 'gallery-square':
            return 'square';
        case 'gallery-portrait':
            return 'portrait';
        case 'gallery-landscape':
            return 'landscape';
        default:
            return 'square';
    }
}

function mapCarouselImageFormat(imageFormat: ImageFormats) {
    switch (imageFormat) {
        case 'carousel-square':
            return 'square';
        case 'carousel-portrait':
            return 'portrait';
        case 'carousel-landscape':
            return 'landscape';
        case 'carousel-big-portrait':
            return 'portrait';
        default:
            return 'square';
    }
}

function mapTripleImageLeft(item: CrossPromotionItems, index: number) {
    const calcIndex = index + 1;
    if (index === 1 || calcIndex % 4 === 0) {
        const mappedImage = {
            small: item.image?.list?.landscape?.small || '',
            medium: item.image?.list?.landscape?.medium,
            semilarge: item.image?.list['portrait']?.semilarge,
            large: item.image?.list['portrait']?.large,
            xlarge: item.image?.list['portrait']?.xlarge,
        };
        return {
            isMain: true,
            size: 'half',
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
            },
            superTitle: item.superTitle,
            title: item.title,
            // href: item.link || undefined,
            link: item.link
                ? {
                      href: item.link,
                      isExternal: isExternalLink(item.link),
                  }
                : undefined,
        } as PromotionCardProps & {
            isMain?: boolean;
            size?: 'full' | 'half' | undefined;
        };
    } else {
        const mappedImage = {
            small: item.image?.list?.landscape?.small || '',
            medium: item.image?.list?.landscape?.medium,
            semilarge: item.image?.list['landscape']?.semilarge,
            large: item.image?.list['landscape']?.large,
            xlarge: item.image?.list['landscape']?.xlarge,
        };
        return {
            isMain: false,
            size: 'half',
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
            },
            superTitle: item.superTitle,
            title: item.title,
            //href: item.link || undefined,
            link: item.link
                ? {
                      href: item.link,
                      isExternal: isExternalLink(item.link),
                  }
                : undefined,
        } as PromotionCardProps & {
            isMain?: boolean;
            size?: 'full' | 'half' | undefined;
        };
    }
}

function mapTripleImageRight(item: CrossPromotionItems, index: number) {
    const calcIndex = index + 1;
    if (calcIndex % 3 === 0) {
        const mappedImage = {
            small: item.image?.list?.landscape?.small || '',
            medium: item.image?.list?.landscape?.medium,
            semilarge: item.image?.list['portrait']?.semilarge,
            large: item.image?.list['portrait']?.large,
            xlarge: item.image?.list['portrait']?.xlarge,
        };
        return {
            isMain: true,
            size: 'half',
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
            },
            superTitle: item.superTitle,
            title: item.title,
            // href: item.link || undefined,
            link: item.link
                ? {
                      href: item.link,
                      isExternal: isExternalLink(item.link),
                  }
                : undefined,
        } as PromotionCardProps & {
            isMain?: boolean;
            size?: 'full' | 'half' | undefined;
        };
    } else {
        const mappedImage = {
            small: item.image?.list?.landscape?.small || '',
            medium: item.image?.list?.landscape?.medium,
            semilarge: item.image?.list['landscape']?.semilarge,
            large: item.image?.list['landscape']?.large,
            xlarge: item.image?.list['landscape']?.xlarge,
        };
        return {
            isMain: false,
            size: 'half',
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
            },
            superTitle: item.superTitle,
            title: item.title,
            // href: item.link || undefined,
            link: item.link
                ? {
                      href: item.link,
                      isExternal: isExternalLink(item.link),
                  }
                : undefined,
        } as PromotionCardProps & {
            isMain?: boolean;
            size?: 'full' | 'half' | undefined;
        };
    }
}

const mapNonTripleGalleryImage = (
    item: CrossPromotionItems,
    index: number,
    array: CrossPromotionItems[],
    imageFormat: ImageFormats,
    isFull: boolean
) => {
    if (array.length === 1) {
        const mappedImage = {
            small: item.image?.list?.['landscape-wide']?.small || '',
            medium: item.image?.list?.['landscape-wide']?.medium,
            large: item.image?.list['landscape-wide']?.large,
            xlarge: item.image?.list['landscape-wide']?.xlarge,
        };
        return {
            size: 'full',
            isMain: true,
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
            },
            superTitle: item.superTitle,
            title: item.title,
            // href: item.link || undefined,
            link: item.link
                ? {
                      href: item.link,
                      isExternal: isExternalLink(item.link),
                  }
                : undefined,
        } as PromotionCardProps & {
            isMain?: boolean;
            size?: 'full' | 'half' | undefined;
        };
    }

    const mappedImageFormat = mapGalleryImageFormat(imageFormat);
    const mappedImage = {
        small: item.image?.list?.landscape?.small || '',
        medium: item.image?.list?.landscape?.medium,
        semilarge: item.image?.list[mappedImageFormat || 'square']?.semilarge,
        large: item.image?.list[mappedImageFormat || 'square']?.large,
        xlarge: item.image?.list[mappedImageFormat || 'square']?.xlarge,
    };
    return {
        size: isFull ? 'full' : 'half',
        isMain: isFull,
        image: {
            ...mappedImage,
            alt: item.image?.meta.altText || '',
        },
        superTitle: item.superTitle,
        title: item.title,
        // href: item.link || undefined,
        link: item.link
            ? {
                  href: item.link,
                  isExternal: isExternalLink(item.link),
              }
            : undefined,
    } as PromotionCardProps & {
        isMain?: boolean;
        size?: 'full' | 'half' | undefined;
    };
};
