import React from 'react';

import { assignTo, FeatureList, ThemeMods } from '@blateral/b.kit';
import {
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { isSVG } from 'utils/mapping';
import { normalizeAnchorId } from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { FeatureProps } from '@blateral/b.kit/lib/components/blocks/Feature';

interface FeatureItemType {
    title?: string;
    text?: string;
    link?: string;
    description?: string;
    image: Omit<ModxImagePropsWithFormat, 'landscape-wide'>;
    actionLabel?: string;

    /** @deprecated */
    primary_link?: string;
    /** @deprecated */
    secondary_link?: string;
    /** @deprecated */
    primary_label?: string;
    /** @deprecated */
    secondary_label?: string;
}

export interface FeatureListSliceType
    extends ModxSlice<'FeatureList', FeatureItemType> {
    isActive?: boolean;
    anchorId?: string;
    isCentered?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
    imageFormat: string;
    columns?: string;

    action?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    theme?: ThemeMods;
}

export const FeatureListSlice: React.FC<FeatureListSliceType> = ({
    anchorId,
    isCentered,
    bgMode,
    bgColor,
    imageFormat,
    items,
    columns,
    action,
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

    const aspectRatios = {
        square: { small: { w: 1, h: 1 } },
        landscape: { small: { w: 4, h: 3 } },
        portrait: { small: { w: 3, h: 4 } },
    };

    return (
        <FeatureList
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            isCentered={isCentered}
            theme={sliceTheme}
            columns={columns ? (+columns === 2 ? 2 : 3) : undefined}
            features={items
                .filter(filterMissingSmallFormat)
                .map<FeatureProps>(
                    ({
                        title,
                        text,
                        description,
                        image,
                        link,
                        actionLabel,
                        primary_label,
                        primary_link,
                        secondary_label,
                        secondary_link,
                    }) => {
                        // check if image urls are path to SVG image
                        const isSvgImage = isSVG(image.landscape?.small);
                        const selectedAspect: {
                            small: { w: number; h: number };
                            semilarge: { w: number; h: number };
                        } = aspectRatios[imageFormat || 'square'];

                        const completeImage: ImageProps & {
                            ratios?: {
                                small: {
                                    w: number;
                                    h: number;
                                };
                            };
                        } = image && {
                            ...image[imageFormat || 'square'],
                            ratios: !isSvgImage ? selectedAspect : undefined,
                            coverSpace: !isSvgImage,
                        };

                        // maintain MODX backward compatibility for primary and secondary action data
                        const actionLabelText =
                            actionLabel || primary_label || secondary_label;
                        const actionHref =
                            link || primary_link || secondary_link;

                        const cardLink = actionHref
                            ? {
                                  href: actionHref,
                                  isExternal: isExternalLink(actionHref),
                              }
                            : undefined;

                        return {
                            title: title,
                            text: text,
                            description: description,
                            image: completeImage,
                            link: cardLink,

                            action:
                                action &&
                                isValidAction(actionLabelText, actionHref)
                                    ? (isInverted: boolean) =>
                                          action({
                                              isInverted,
                                              label: actionLabelText,
                                              href: actionHref || '',
                                              isExternal:
                                                  isExternalLink(actionHref),
                                          })
                                    : undefined,
                        };
                    }
                )}
        />
    );
};

const filterMissingSmallFormat = (item: FeatureItemType) =>
    item.image.landscape?.small ||
    item.image.portrait?.small ||
    item.image.square?.small;
