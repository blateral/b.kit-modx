import React from 'react';

import { assignTo, FlyToIcon, Map, Theme } from '@blateral/b.kit/lib';
import {
    isExternalLink,
    isNumeric,
    isValidAction,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';

interface MapLocationItems {
    marker?: Pick<ModxImageProps, 'small' | 'meta'>;

    longitude?: string;
    latitude?: string;
    title?: string;
    titleAs?: string;
    contact?: string;

    primary_link?: string;
    primary_label?: string;
    secondary_link?: string;
    secondary_label?: string;
}

export interface MapSliceType extends ModxSlice<'Map', MapLocationItems> {
    isActive?: boolean;
    bgMode?: string;
    bgColor?: string;
    isMirrored?: boolean;
    withFlyTo?: boolean;
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
    theme?: Theme;
}

export const MapSlice: React.FC<MapSliceType> = ({
    bgMode,
    bgColor,
    isMirrored,
    withFlyTo,
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

    return (
        <Map
            theme={sliceTheme}
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

                return {
                    id: `location-${i}`,
                    position: [posLat, posLng],
                    meta: {
                        title: location.title,
                        contact: location.contact,

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
                    },
                    icon: {
                        size: iconSettings?.size || [20, 28],
                        anchor: iconSettings?.anchor || [10, 28],
                        sizeActive: iconSettings?.sizeActive || [50, 70],
                        anchorActive: iconSettings?.anchorActive || [25, 70],
                        url: location.marker?.small || '',
                    },
                };
            })}
            controlNext={controlNext}
            controlPrev={controlPrev}
            dot={dot}
        />
    );
};
