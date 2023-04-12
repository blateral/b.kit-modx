import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { PromotionCardProps } from '@blateral/b.kit/types/components/blocks/PromotionCard';

import {
    BgMode,
    isExternalLink,
    ModxImageMetaData,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const CrossPromotion = React.lazy(() => import('imports/_CrossPromotionList'));

interface CrossPromotionItems {
    isMain?: boolean;
    image?: {
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
    | 'landscape-wide';

export interface CrossPromotionListSliceType
    extends ModxSlice<'CrossPromotionList', CrossPromotionItems> {
    isActive?: boolean;
    anchorId?: string;
    isMirrored?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
    externalLinkIcon?: React.ReactNode;
    imageFormat: ImageFormats;

    theme?: ThemeMods;
}

export const CrossPromotionListSlice: React.FC<CrossPromotionListSliceType> = ({
    items,
    isMirrored,
    imageFormat,
    bgColor,
    theme,
    anchorId,
    externalLinkIcon,
    bgMode,
}) => {
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
                sectionBg: {
                    medium: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <CrossPromotion
            anchorId={normalizeAnchorId(anchorId)}
            externalLinkIcon={externalLinkIcon}
            theme={sliceTheme}
            isMirrored={isImagesMirrored}
            bgMode={bgMode}
            main={mainItems}
            aside={asideItems.length > 0 ? asideItems : undefined}
        />
    );
};

const mapGalleryImageFormat = (imageFormat: ImageFormats) => {
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
};

const mapImageRatio = (
    format: 'portrait' | 'landscape' | 'square' | 'landscape-wide'
) => {
    let ratio = { h: 1, w: 1 };
    switch (format) {
        case 'landscape': {
            ratio = { w: 4, h: 3 };
            break;
        }
        case 'portrait': {
            ratio = { w: 3, h: 4 };
            break;
        }
        case 'landscape-wide': {
            ratio = { w: 5, h: 2 };
            break;
        }
        default: {
            ratio = { w: 1, h: 1 };
        }
    }
    return ratio;
};

const mapTripleImageLeft = (item: CrossPromotionItems, index: number) => {
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
                ratios: {
                    small: mapImageRatio('landscape'),
                    semilarge: mapImageRatio('portrait'),
                },
            },
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
                ratios: {
                    small: mapImageRatio('landscape'),
                },
            },
            title: item.title,
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
};

function mapTripleImageRight(item: CrossPromotionItems, index: number) {
    const calcIndex = index + 1;
    if (calcIndex % 3 === 0) {
        const mappedImage = {
            small: item.image?.list['landscape']?.small || '',
            medium: item.image?.list['landscape']?.medium,
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
                ratios: {
                    small: mapImageRatio('landscape'),
                    semilarge: mapImageRatio('portrait'),
                },
            },
            superTitle: item.superTitle,
            title: item.title,
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
                ratios: {
                    small: mapImageRatio('landscape'),
                },
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
            small: item.image?.list?.['landscape']?.small || '',
            medium: item.image?.list?.['landscape']?.medium,
            large: item.image?.list['landscape-wide']?.large,
            xlarge: item.image?.list['landscape-wide']?.xlarge,
        };

        return {
            size: 'full',
            isMain: true,
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
                ratios: {
                    small: mapImageRatio('landscape'),
                    semilarge: mapImageRatio('landscape-wide'),
                },
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
            ratios: {
                small: mapImageRatio('landscape'),
                semilarge: mapImageRatio(mappedImageFormat),
            },
        },
        superTitle: item.superTitle,
        title: item.title,
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
