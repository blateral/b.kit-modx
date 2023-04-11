import {
    assignTo,
    concat,
    EventOverview,
    isValidArray,
    ThemeMods,
    useLibTheme,
} from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';
import { EventItem } from '@blateral/b.kit/lib/components/sections/events/EventOverview';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';
import React from 'react';
import {
    isExternalLink,
    isValidAction,
    ModxSlice,
    parseModxDateString,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { getFilterTagsArray } from 'utils/filterTags';

interface Event {
    alias?: string;
    tags?: string;
    title?: string;
    date?: string;
    /** @deprecated */
    image?: ImageProps;
    images?: ImageProps[];
    intro?: string;
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

interface EventCollection {
    alias?: string;
    events?: Array<Event>;
}

export interface EventOverviewSliceType extends ModxSlice<'EventOverview'> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    anchorId?: string;
    hasImages?: boolean;
    primary_label?: string;
    collection?: EventCollection;
    queryParams?: Record<string, any>;
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

export const EventOverviewSlice: React.FC<EventOverviewSliceType> = ({
    anchorId,
    bgMode,
    bgColor,
    hasImages,
    primary_label,
    collection,
    customTag,
    action,
    queryParams,
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

    // get new theme (parent theme + sliceTheme) that is also used inside NewsOverview component
    const { theme: parentTheme } = useLibTheme();
    const filterName = assignTo(parentTheme, sliceTheme).globals.sections
        .eventFilterName;

    // get inital data from query params (serverside)
    const initialTags = getFilterTagsArray(queryParams?.[filterName]);
    const initialRows = queryParams?.rows
        ? parseInt(queryParams.rows)
        : undefined;

    const collectionUrl = collection?.alias;
    const events = collection?.events
        ?.filter(removePastFilterFn)
        ?.sort(sortFilterFn);

    const mapEventItemsToOverviewItems = () => {
        return events?.map((item): EventItem => {
            const tagsArray =
                item.tags?.split(',')?.map((tag) => tag.trim()) || [];

            const tagPropsArray = tagsArray.map((tag): TagProps => {
                return {
                    name: tag,
                    link: {
                        href: collectionUrl ? `/${collectionUrl}` : undefined,
                    },
                };
            });

            const address = concat(
                [item.address?.locationName, item.address?.adress],
                ' | '
            );

            const images: ImageProps[] = [];
            if (item.images) {
                images.push(...item.images);
            } else if (item.image) {
                // fallback
                images.push(item.image);
            }

            return {
                link: {
                    href: item.alias || '',
                },
                title: item.title || '',
                address: address,
                duration: +(item.duration || 0) * 60,
                tags: tagPropsArray,
                images: hasImages ? images : undefined,
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
        });
    };

    return (
        <EventOverview
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            initial={{
                visibleRows: initialRows,
                activeTags: isValidArray(initialTags, false)
                    ? initialTags
                    : undefined,
            }}
            tags={collection ? getUniqueTags(collection) : []}
            customTag={customTag}
            events={mapEventItemsToOverviewItems()}
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

const getUniqueTags = (collection: EventCollection): string[] => {
    const tags: string[] = [];
    const events = collection?.events?.filter(removePastFilterFn);

    const newTags = events?.reduce<string[]>((acc, current) => {
        const eventTags = current.tags?.split(',')?.map((tag) => tag.trim());
        if (!isValidArray(eventTags, false)) return acc;

        const tagsToAdd: string[] = [];
        for (const tag of eventTags) {
            if (acc.includes(tag) || tagsToAdd.includes(tag)) continue;
            tagsToAdd.push(tag);
        }

        return [...acc, ...tagsToAdd];
    }, []);

    if (isValidArray(newTags, false)) {
        tags.push(...newTags);
    }

    return tags;
};
