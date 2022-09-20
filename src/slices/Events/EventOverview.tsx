import { EventOverview, isValidArray, ThemeMods } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';
import { EventItem } from '@blateral/b.kit/lib/components/sections/events/EventOverview';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';
import React from 'react';
import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

interface Event {
    alias?: string;
    tags?: string;
    title?: string;
    date?: string;
    image?: ImageProps;
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
    hasImages,
    primary_label,
    collection,
    customTag,
    action,
}) => {
    const collectionUrl = collection?.alias;

    const mapEventItemsToOverviewItems = () => {
        return collection?.events?.map((item): EventItem => {
            const tagsArray =
                item.tags?.split(',')?.map((tag) => tag.trim()) || [];

            const tagPropsArray = tagsArray.map((tag): TagProps => {
                return {
                    name: tag,
                    link: {
                        href: collectionUrl
                            ? `/${collectionUrl}?eventsFilter=${tag}`
                            : undefined,
                    },
                };
            });

            return {
                link: {
                    href: item.alias || '',
                },
                title: item.title || '',
                text: item.intro || '',
                tags: tagPropsArray,
                image: item.image && hasImages ? item.image : undefined,
                date: createDateObjectFromModxDatestring(item.date),
                action:
                    action && isValidAction(primary_label, item.alias)
                        ? ({ isInverted }: { isInverted: any }) =>
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
            tags={collection ? getUniqueTags(collection) : []}
            customTag={customTag}
            events={mapEventItemsToOverviewItems()}
        />
    );
};

const removePastFilterFn = (item: Event) => {
    if (!item.date) return false;
    const date = createDateObjectFromModxDatestring(item.date);
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date >= today;
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

const createDateObjectFromModxDatestring = (modxDateString?: string) => {
    if (!modxDateString) return undefined;

    // "2022-04-21 14:15:00"
    try {
        const dateParts = modxDateString.split(' ');

        const dateSnippets = dateParts[0].split('-');

        let timeSnippets: string[] = [];
        if (dateParts.length > 1) {
            timeSnippets = dateParts[1].split(':');
        }
        const hasTimeSnippets = timeSnippets.length > 0;

        const year = +dateSnippets[0];
        const month = +dateSnippets[1] - 1 < 0 ? 0 : +dateSnippets[1] - 1;
        const day = +dateSnippets[2];

        return new Date(
            year,
            month,
            day,
            hasTimeSnippets ? +timeSnippets[0] : undefined,
            hasTimeSnippets ? +timeSnippets[1] : undefined,
            hasTimeSnippets ? +timeSnippets[2] : undefined
        );
    } catch (e) {
        console.error('Error: Generating date for eventlist item failed');

        return new Date(1970, 1, 1);
    }
};
