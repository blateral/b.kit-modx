import {
    assignTo,
    concat,
    EventList,
    getEventFilterParams,
    ThemeMods,
} from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';
import React from 'react';
import {
    isExternalLink,
    isValidAction,
    ModxSlice,
    parseModxDateString,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

interface EventCollection {
    alias?: string;
    events?: Array<Event>;
}

interface Event {
    alias?: string;
    tags?: string;
    title?: string;
    date?: string;
    image?: ImageProps;
    duration?: string;
    price?: string;
    priceInfo?: string;
    address: {
        locationName?: string;
        adress?: string;
        email?: string;
        phone?: string;
        website?: string;
    };
    booking: {
        email?: string;
        phone?: string;
        ticketUrl?: string;
        website?: string;
    };
}

export interface EventListSliceType extends ModxSlice<'EventList'> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    anchorId?: string;
    hasImages?: boolean;
    primary_label?: string;
    collection?: EventCollection;
    customTag?: (props: {
        name: string;
        isInverted?: boolean;
        isActive?: boolean;
        link?: LinkProps;
    }) => React.ReactNode;
    action?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    theme?: ThemeMods;
}

export const EventListSlice: React.FC<EventListSliceType> = ({
    anchorId,
    bgMode,
    bgColor,
    hasImages,
    primary_label,
    collection,
    customTag,
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

    const collectionUrl = collection?.alias;
    const events = collection?.events
        ?.filter(removePastFilterFn)
        ?.sort(sortFilterFn);

    return (
        <EventList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            customTag={customTag}
            events={events?.slice(0, 3).map((item) => {
                const tagsArray =
                    item.tags?.split(',')?.map((tag) => tag.trim()) || [];

                const tagPropsArray = tagsArray.map((tag): TagProps => {
                    return {
                        name: tag,
                        link: {
                            href: collectionUrl
                                ? getEventFilterParams(`/${collectionUrl}`, [
                                      tag,
                                  ])
                                : undefined,
                        },
                    };
                });

                const address = concat(
                    [item.address?.locationName, item.address?.adress],
                    ' | '
                );

                return {
                    link: {
                        href: item.alias || '',
                    },
                    title: item.title || '',
                    address: address,
                    duration: +(item.duration || 0) * 60,
                    tags: tagPropsArray,
                    image: item.image && hasImages ? item.image : undefined,
                    date: parseModxDateString(item.date),
                    action:
                        action && isValidAction(primary_label, item.alias)
                            ? ({ isInverted }) =>
                                  action({
                                      isInverted,
                                      label: primary_label,
                                      href:
                                          item.alias ||
                                          item.booking.ticketUrl ||
                                          item.booking.website,
                                      isExternal: isExternalLink(
                                          item.alias ||
                                              item.booking.ticketUrl ||
                                              item.booking.website
                                      ),
                                  })
                            : undefined,
                };
            })}
        />
    );
};

const removePastFilterFn = (item: Event) => {
    if (!item.date) return false;
    const date = parseModxDateString(item.date);
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date >= today;
};

const sortFilterFn = (a: Event, b: Event) => {
    const dateA = parseModxDateString(a.date);
    const dateB = parseModxDateString(b.date);

    if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
    } else return 0;
};
