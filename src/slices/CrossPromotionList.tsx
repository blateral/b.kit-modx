import { CrossPromotion, PromotionCarousel } from '@blateral/b.kit';

import { PromotionCardProps } from '@blateral/b.kit/lib/components/blocks/PromotionCard';
import React from 'react';
import {
    BgMode,
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
    title?: string;
    link?: string;
}

export interface CrossPromotionListSliceType
    extends ModxSlice<'CrossPromotionList', CrossPromotionItems> {
    isActive?: boolean;
    isCarousel?: boolean;
    isMirrored?: boolean;
    bgMode?: BgMode;
    imageFormat: 'square' | 'landscape' | 'landscape-wide' | 'portrait';

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
    imageFormat,
    isMirrored,

    items,
}: CrossPromotionListSliceType) => {
    const promoItems: Array<CrossPromotionItems> = items;
    const itemCount = promoItems.length;

    const mapPromotionItem = (item: CrossPromotionItems) => {
        const isFull =
            itemCount === 1 || imageFormat === 'landscape-wide' || item.isMain;
        if (isFull) imageFormat = 'landscape-wide';

        const mappedImage = {
            small: item.image?.list?.landscape?.small || '',
            medium: item.image?.list?.landscape?.medium,
            semilarge: item.image?.list[imageFormat || 'square']?.semilarge,
            large: item.image?.list[imageFormat || 'square']?.large,
            xlarge: item.image?.list[imageFormat || 'square']?.xlarge,
        };

        return {
            size: isFull ? 'full' : 'half',
            image: {
                ...mappedImage,
                alt: item.image?.meta.altText || '',
            },
            title: item.title,
            href: item.link || undefined,
        } as PromotionCardProps & { size?: 'full' | 'half' | undefined };
    };

    const mainItems = promoItems.filter((item) => item.isMain);
    const asideItems = promoItems.filter((item) => !item.isMain);

    return (
        <CrossPromotion
            isMirrored={isMirrored}
            bgMode={bgMode}
            main={
                mainItems.length > 0
                    ? mainItems.map((item: CrossPromotionItems) =>
                          mapPromotionItem(item)
                      )
                    : undefined
            }
            aside={
                asideItems.length > 0
                    ? asideItems.map((item: CrossPromotionItems) =>
                          mapPromotionItem(item)
                      )
                    : undefined
            }
        />
    );
};

const createCPromoCarousel = ({
    bgMode,
    imageFormat,

    items,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
}: CrossPromotionListSliceType) => {
    return (
        <PromotionCarousel
            bgMode={bgMode}
            promotions={items.map(({ image, title, link }) => {
                const mappedImage = {
                    small: image?.list?.landscape?.small || '',
                    medium: image?.list[imageFormat || 'square']?.medium,
                    semilarge: image?.list[imageFormat || 'square']?.semilarge,
                    large: image?.list[imageFormat || 'square']?.large,
                    xlarge: image?.list[imageFormat || 'square']?.xlarge,
                };

                return {
                    href: link || undefined,
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
            slidesToShow={slidesToShow}
            responsive={responsive}
        />
    );
};
