import { assignTo, EventList, ThemeMods } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';
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
    bgColor?: string;
    anchor?: {
        id?: string;
        label?: string;
    };
    hasImages?: boolean;
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
    theme?: ThemeMods;
}

export const EventListSlice: React.FC<EventListSliceType> = ({
    anchor,
    bgMode,
    bgColor,
    hasImages,
    primary_label,
    collection,
    onTagClick,
    customTag,
    action,
    theme,
}) => {
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

    const collectionUrl = collection?.alias;

    return (
        <EventList
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            customTag={customTag}
            onTagClick={onTagClick}
            events={
                collection?.events &&
                collection.events.slice(0, 3).map((item) => {
                    const tagsArray =
                        item?.tags && item.tags.length > 0
                            ? item.tags?.split(',')
                            : [];

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
