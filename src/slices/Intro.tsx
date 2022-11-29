import {
    ModxSlice,
    isExternalLink,
    isHeadlineTag,
    isValidAction,
    ModxImageProps,
} from 'utils/modx';

import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { HeadlineTagDefault } from 'utils/stringLexicon';
import { assignTo, Intro, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { normalizeAnchorId } from 'utils/mapping';
import { ImageAspectRatios } from '@blateral/b.kit/lib/components/blocks/Image';

type BgMode = 'full' | 'splitted' | 'inverted';

export interface IntroSliceType extends ModxSlice<'Intro'> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;
    image?: ModxImageProps & {
        originals?: {
            w?: number;
            h?: number;
        };
    };
    title?: string;
    titleAs?: HeadlineTag;
    superTitle?: string;
    superTitleAs?: string;
    abstract?: string;
    text?: string;

    isCentered?: boolean;
    isStackable?: boolean;

    primary_link?: string;
    secondary_link?: string;
    primary_label?: string;
    secondary_label?: string;

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
    theme?: ThemeMods;
}

export const IntroSlice: React.FC<IntroSliceType> = ({
    anchorId,
    isCentered,
    isStackable,
    bgMode,
    bgColor,
    image,
    title,
    titleAs,
    superTitle,
    superTitleAs,
    abstract,
    text,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,

    primaryAction,
    secondaryAction,
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

    const originalSize = image?.originals;
    let imgRatios: ImageAspectRatios | undefined = undefined;

    if (originalSize?.w && originalSize?.h) {
        imgRatios = {
            small: { w: originalSize.w, h: originalSize.h },
        };
    }

    return (
        <Intro
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            isStackable={isStackable}
            isCentered={isCentered}
            image={
                image
                    ? {
                          small: image.small,
                          medium: image.medium,
                          semilarge: image.semilarge,
                          large: image.large,
                          xlarge: image.xlarge,
                          copyright: image.meta?.copyright || '',
                          alt: image.meta?.altText || '',
                          ratios: imgRatios,
                          coverSpace: !imgRatios,
                      }
                    : undefined
            }
            title={title || ''}
            superTitle={superTitle}
            superTitleAs={
                isHeadlineTag(superTitleAs)
                    ? (superTitleAs as HeadlineTag)
                    : HeadlineTagDefault
            }
            titleAs={
                isHeadlineTag(titleAs)
                    ? (titleAs as HeadlineTag)
                    : HeadlineTagDefault
            }
            titleSize={titleAs === 'h1' ? 'heading-1' : 'heading-2'}
            abstract={abstract}
            text={text}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted: boolean) =>
                          primaryAction({
                              isInverted,
                              label: primary_label,
                              href: primary_link || '',
                              isExternal: isExternalLink(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted: boolean) =>
                          secondaryAction({
                              isInverted,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
        />
    );
};

export const getIntroSearchData = (slice: IntroSliceType): string[] => {
    const data: string[] = [];
    if (slice?.title) data.push(slice.title);
    if (slice?.text) data.push(slice.text);
    return data;
};
