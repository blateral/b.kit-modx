import React from 'react';

import {
    FlyToIcon,
    MailIcon,
    Map,
    PhoneIcon,
    RouteIcon,
} from '@blateral/b.kit/lib';
import {
    isExternalLink,
    isHeadlineTag,
    isNumeric,
    isValidAction,
    ModxSlice,
} from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { HeadlineTagDefault } from 'utils/stringLexicon';

interface MapLocationItems {
    superTitle?: string;
    superTitleAs?: string;

    title?: string;
    titleAs?: string;
    longitude?: string;
    latitude?: string;
    marker?: string;

    phone?: string;
    mail?: string;
    route?: string;

    primary_link?: string;
    primary_label?: string;
    secondary_link?: string;
    secondary_label?: string;
}

export interface MapSliceType extends ModxSlice<'Map', MapLocationItems> {
    primary: {
        is_active?: boolean;
        bgMode?: string;
        isMirrored?: boolean;
        withFlyTo?: boolean;
    };
    // helpers to define component elements outside of slice
    center?: [number, number];
    zoom?: number;
    flyToZoom?: number;
    /** Show all markers on first load */
    allMarkersOnInit?: boolean;
    /** Map container padding for show all markers */
    fitBoundsPadding?: [number, number];
    iconSettings: {
        size: [number, number];
        anchor: [number, number];
        sizeActive: [number, number];
        anchorActive: [number, number];
    };
    flyToControl?: React.ReactNode;
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
    phoneIcon?: (isInverted?: boolean) => React.ReactNode;
    mailIcon?: (isInverted?: boolean) => React.ReactNode;
    routingIcon?: (isInverted?: boolean) => React.ReactNode;
}

export const MapSlice: React.FC<MapSliceType> = ({
    primary: { bgMode, isMirrored, withFlyTo },
    items,
    iconSettings,
    center,
    zoom,
    flyToZoom,
    flyToControl,
    fitBoundsPadding,
    allMarkersOnInit,
    primaryAction,
    secondaryAction,
    controlNext,
    controlPrev,
    dot,
    phoneIcon,
    mailIcon,
    routingIcon,
}) => {
    return (
        <Map
            bgMode={bgMode === 'inverted' ? 'inverted' : 'full'}
            isMirrored={isMirrored}
            initialLocation={items?.length > 0 ? `location-0` : undefined}
            center={center}
            zoom={zoom}
            flyToZoom={flyToZoom || 12}
            flyToControl={withFlyTo ? flyToControl || <FlyToIcon /> : undefined}
            allMarkersOnInit={allMarkersOnInit}
            fitBoundsPadding={fitBoundsPadding || [30, 30]}
            locations={items?.map((location, i) => {
                const posLat =
                    location.latitude && isNumeric(location.latitude)
                        ? +location.latitude
                        : 0;
                const posLng =
                    location.longitude && isNumeric(location.longitude)
                        ? +location.longitude
                        : 0;

                const contactInfo: {
                    label: string;
                    icon: React.ReactNode;
                }[] = [];
                if (location.phone) {
                    contactInfo.push({
                        icon: phoneIcon || <PhoneIcon />,
                        label: location?.phone,
                    });
                }
                if (location.mail) {
                    contactInfo.push({
                        icon: mailIcon || <MailIcon />,
                        label: location?.mail,
                    });
                }
                if (location.route) {
                    contactInfo.push({
                        icon: routingIcon || <RouteIcon />,
                        label: location?.route,
                    });
                }

                return {
                    id: `location-${i}`,
                    position: [posLat, posLng],
                    meta: {
                        title: location.title,
                        titleAs: 'span',
                        superTitle: location.superTitle,
                        superTitleAs: isHeadlineTag(location.superTitleAs)
                            ? (location.superTitleAs as HeadlineTag)
                            : HeadlineTagDefault,

                        primaryAction:
                            primaryAction &&
                            isValidAction(
                                location.primary_label,
                                location.primary_link
                            )
                                ? (isInverted?: boolean) =>
                                      primaryAction({
                                          isInverted,
                                          label: location.primary_label,
                                          href: location.primary_link || '',
                                          isExternal: isExternalLink(
                                              location.primary_link
                                          ),
                                      })
                                : undefined,
                        secondaryAction:
                            secondaryAction &&
                            isValidAction(
                                location.secondary_label,
                                location.secondary_link
                            )
                                ? (isInverted?: boolean) =>
                                      secondaryAction({
                                          isInverted,
                                          label: location.secondary_label,
                                          href: location.secondary_link || '',
                                          isExternal: isExternalLink(
                                              location.secondary_link
                                          ),
                                      })
                                : undefined,

                        contact: contactInfo,
                    },
                    icon: {
                        size: iconSettings?.size || [20, 28],
                        anchor: iconSettings?.anchor || [10, 28],
                        sizeActive: iconSettings?.sizeActive || [50, 70],
                        anchorActive: iconSettings?.anchorActive || [25, 70],
                        url: location.marker || '',
                    },
                };
            })}
            controlNext={controlNext}
            controlPrev={controlPrev}
            dot={dot}
        />
    );
};
