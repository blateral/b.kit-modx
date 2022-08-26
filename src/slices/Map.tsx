import React from 'react';

import { assignTo, Map, ThemeMods } from '@blateral/b.kit/lib';
import { isHeadlineTag, ModxSlice } from 'utils/modx';
import { MapLocation } from '@blateral/b.kit/lib/components/sections/Map';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { normalizeAnchorId } from 'utils/mapping';
import { Icons } from '@blateral/b.kit';

interface MapLocationItems {
    marker?: string;
    longitude?: string;
    latitude?: string;

    title?: string;
    titleAs?: string;
    superTitle?: string;
    superTitleAs?: HeadlineTag;

    companyName?: string;
    address: {
        street: string;
        postalCode: string;
        city?: string;
        country: string;
    };
    telephone?: {
        link?: string;
        label?: string;
        icon?: (props: { isInverted?: boolean }) => React.ReactNode;
    };
    email?: {
        link?: string;
        label?: string;
        icon?: (props: { isInverted?: boolean }) => React.ReactNode;
    };

    // JSON-LD only prop
    image?: string[];
    description?: string;
}

export interface MapSliceType extends ModxSlice<'Map', MapLocationItems> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: string;
    bgColor?: string;
    isMirrored?: boolean;
    withFlyTo?: boolean;
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
    controlNext?: (props: {
        isInverted?: boolean;
        disabled?: boolean;
        isActive?: boolean;
        name?: string;
        clickHandler?: (
            ev: React.SyntheticEvent<HTMLButtonElement, Event>
        ) => void;
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        disabled?: boolean;
        isActive?: boolean;
        name?: string;
        clickHandler?: (
            ev: React.SyntheticEvent<HTMLButtonElement, Event>
        ) => void;
    }) => React.ReactNode;
    addressIcon?: (props: { isInverted?: boolean }) => React.ReactNode;
    phoneIcon?: (props: { isInverted?: boolean }) => React.ReactNode;
    mailIcon?: (props: { isInverted?: boolean }) => React.ReactNode;
    routingIcon?: (props: { isInverted?: boolean }) => React.ReactNode;
    theme?: ThemeMods;
}

export const MapSlice: React.FC<MapSliceType> = ({
    bgMode,
    anchorId,
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
    controlNext,
    controlPrev,
    addressIcon,
    mailIcon,
    phoneIcon,
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

    const isInverted = bgMode === 'inverted';

    return (
        <Map
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={isInverted ? 'inverted' : 'full'}
            isMirrored={isMirrored}
            initialLocation={items?.length > 0 ? `location-0` : undefined}
            center={center}
            zoom={zoom}
            flyToZoom={flyToZoom || 12}
            flyToControl={
                withFlyTo ? flyToControl || <Icons.FlyTo /> : undefined
            }
            allMarkersOnInit={allMarkersOnInit}
            fitBoundsPadding={fitBoundsPadding || [30, 30]}
            locations={items?.map<MapLocation>((location, i) => {
                const posLat = location.latitude ? +location.latitude : 0;
                const posLng = location.longitude ? +location.longitude : 0;

                return {
                    id: `location-${i}`,
                    position: [posLat, posLng],
                    title: location.title || '',
                    titleAs: isHeadlineTag(location.titleAs)
                        ? location.titleAs
                        : 'h2',
                    superTitle: location.superTitle || '',
                    superTitleAs: isHeadlineTag(location.superTitleAs)
                        ? location.superTitleAs
                        : 'h2',
                    companyName: location.companyName,
                    address: location.address,
                    addressIcon: addressIcon
                        ? () => addressIcon({ isInverted })
                        : undefined,
                    contact: {
                        email: {
                            ...location.email,
                            icon: mailIcon
                                ? () =>
                                      mailIcon({
                                          isInverted,
                                      })
                                : undefined,
                        },
                        telephone: {
                            ...location.telephone,
                            icon: phoneIcon
                                ? () =>
                                      phoneIcon({
                                          isInverted,
                                      })
                                : undefined,
                        },
                    },
                    description: location.description,
                    image:
                        location?.image && location.image.length > 0
                            ? location.image
                            : undefined,
                    icon: {
                        size: iconSettings?.size || [20, 28],
                        anchor: iconSettings?.anchor || [10, 28],
                        sizeActive: iconSettings?.sizeActive || [50, 70],
                        anchorActive: iconSettings?.anchorActive || [25, 70],
                        url: location.marker ? `${location.marker}` : '',
                    },
                };
            })}
            controlNext={controlNext}
            controlPrev={controlPrev}
        />
    );
};
