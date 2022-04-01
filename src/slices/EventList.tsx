import { EventList } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import React from 'react';
import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';

interface EventCollection {
    alias?: string;
    events?: Array<{
        alias?: string;
        tags?: string;
        title?: string;
        date?: string;
        image?: ImageProps;
        intro?: string;
        description?: string;
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
    }>;
}

export interface EventListSliceType extends ModxSlice<'EventList'> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    anchor?: {
        id?: string;
        label?: string;
    };
    primary_label?: string;
    collection?: EventCollection;
    onTagClick?: (tag: string) => void;
    customTag?: (props: {
        name: string;
        isInverted?: boolean;
        isActive?: boolean;
        clickHandler?: (ev?: React.SyntheticEvent<HTMLButtonElement>) => void;
    }) => React.ReactNode;
    action?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const EventListSlice: React.FC<EventListSliceType> = ({
    anchor,
    bgMode,
    primary_label,
    collection,
    onTagClick,
    customTag,
    action,
}) => {
    // merging cms and component theme settings

    return (
        <EventList
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            customTag={customTag}
            onTagClick={onTagClick}
            events={
                collection?.events &&
                collection.events.map((item) => {
                    return {
                        title: item.title || '',
                        text: item.description,
                        tags: item.tags?.split(',') || [],
                        image: item.image || undefined,
                        date: createDateObjectFromModxDatestring(item.date),
                        action:
                            action &&
                            isValidAction(
                                primary_label,
                                item.booking.ticketUrl || item.booking.website
                            )
                                ? ({ isInverted }) =>
                                      action({
                                          isInverted,
                                          label: primary_label,
                                          href:
                                              item.booking.ticketUrl ||
                                              item.booking.website,
                                          isExternal: isExternalLink(
                                              item.booking.ticketUrl ||
                                                  item.booking.website
                                          ),
                                      })
                                : undefined,
                    };
                })
            }
        />
    );
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

        return new Date(
            +dateSnippets[0],
            +dateSnippets[1],
            +dateSnippets[2],
            hasTimeSnippets ? +timeSnippets[0] : undefined,
            hasTimeSnippets ? +timeSnippets[1] : undefined,
            hasTimeSnippets ? +timeSnippets[2] : undefined
        );
    } catch (e) {
        console.error('Error: Generating date for eventlist item failed');

        return new Date(1970, 1, 1);
    }
};
