import React from 'react';
import {
    ThemeMods,
    Icons,
    concat,
    printAnchorTag,
    PointOfInterestMap,
} from '@blateral/b.kit';
import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { getGoogleMapsURL } from 'utils/googleMaps';
import { Info } from '@blateral/b.kit/lib/components/blocks/InfoList';
import { LocationIcon } from '@blateral/b.kit/lib/components/sections/Map';

interface POICollection {
    alias?: string;
    poiOverviewUrl?: string;
    pois?: PointOfInterest[];
}

interface POIMigxFact {
    MIGX_id: string;
    name?: string;
}

interface PointOfInterest {
    id: number;
    alias?: string;
    link?: {
        href?: string;
    };
    name?: string;
    shortDescription?: string;
    position?: {
        street?: string;
        housenumber?: string;
        postalCode?: string;
        city?: string;
        state?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        mail?: string;
        phone?: string;
        website?: string;
    };
    facts: POIMigxFact[];
}

export interface PointOfInterestMapSliceType extends ModxSlice<'POIMap'> {
    isActive?: boolean;
    anchorId?: string;

    size?: 'default' | 'large';

    primary_label?: string;
    collection?: POICollection;

    center?: [number, number];
    zoom?: number;
    flyToZoom?: number;
    allMarkersOnInit?: boolean;
    fitBoundsPadding?: [number, number];
    showOwnPosition?: boolean;
    restrictToMarkersArea?: boolean;
    markerAreaBufferRatio?: number;
    attribution?: string;
    provider?: string;
    minZoom?: number;
    maxZoom?: number;

    markerSettings?: LocationIcon;
    currentPosMarker?: LocationIcon;

    customFact?: (props: { key: React.Key; name: string }) => React.ReactNode;
    action?: (props: {
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    locationIcon?: (isInverted?: boolean) => React.ReactNode;
    mapIcon?: (isInverted?: boolean) => React.ReactNode;
    phoneIcon?: (isInverted?: boolean) => React.ReactNode;
    mailIcon?: (isInverted?: boolean) => React.ReactNode;
    webIcon?: (isInverted?: boolean) => React.ReactNode;
    customCardClose?: React.ReactNode;
    customLocationRequest?: React.ReactNode;

    theme?: ThemeMods;
}

export const PointOfInterestMapSlice: React.FC<PointOfInterestMapSliceType> = ({
    anchorId,
    size,
    primary_label,
    collection,
    markerSettings,
    currentPosMarker,
    center,
    zoom,
    flyToZoom = 12,
    allMarkersOnInit = true,
    fitBoundsPadding = [30, 30],
    showOwnPosition = true,
    restrictToMarkersArea = true,
    markerAreaBufferRatio = 0.4,
    attribution,
    provider,
    minZoom,
    maxZoom,
    customCardClose,
    customLocationRequest,
    theme,
    customFact,
    action,
    locationIcon,
    mapIcon,
    phoneIcon,
    mailIcon,
    webIcon,
}) => {
    return (
        <PointOfInterestMap
            theme={theme}
            anchorId={normalizeAnchorId(anchorId)}
            size={size}
            center={center}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            flyToZoom={flyToZoom}
            allMarkersOnInit={allMarkersOnInit}
            fitBoundsPadding={fitBoundsPadding}
            showOwnPosition={showOwnPosition}
            restrictToMarkersArea={restrictToMarkersArea}
            markerAreaBufferRatio={markerAreaBufferRatio}
            provider={provider}
            attribution={attribution}
            pois={collection?.pois
                ?.filter(
                    (poi) => poi.position?.latitude && poi.position?.longitude
                )
                ?.map((poi, i) => {
                    const infos: Info[] = [];
                    const id = poi.id !== undefined ? poi.id : i;

                    // mapping address
                    const street = poi.position?.street;
                    const houseNumber = poi.position?.housenumber;
                    const city = poi.position?.city;
                    const plz = poi.position?.postalCode;
                    const lat = poi.position?.latitude;
                    const lng = poi.position?.longitude;

                    const plzAndCity = concat([plz, city], ' ');
                    const streetAndNumber = concat([street, houseNumber], ' ');
                    const address = concat([streetAndNumber, plzAndCity], ', ');

                    if (address) {
                        infos.push({
                            text: address,
                            icon: () =>
                                locationIcon ? (
                                    locationIcon(false)
                                ) : (
                                    <Icons.LocationPin />
                                ),
                        });
                    }

                    let searchQuery = '';
                    if (streetAndNumber && city) {
                        searchQuery = concat([streetAndNumber, city], ', ');
                    } else if (lat !== undefined && lng !== undefined) {
                        searchQuery = concat([lat, lng], ',');
                    }

                    if (searchQuery) {
                        infos.push({
                            icon: () =>
                                mapIcon ? mapIcon(false) : <Icons.Map />,
                            text: printAnchorTag({
                                href: getGoogleMapsURL(searchQuery) || '',
                                isExternal: true,
                                label: 'Auf Karte anzeigen',
                            }),
                        });
                    }

                    if (poi.position?.phone) {
                        infos.push({
                            icon: () =>
                                phoneIcon ? phoneIcon(false) : <Icons.Phone />,
                            text: printAnchorTag({
                                href: poi?.position?.phone,
                                label: poi?.position?.phone,
                                type: 'phone',
                            }),
                        });
                    }

                    if (poi.position?.mail) {
                        infos.push({
                            icon: () =>
                                mailIcon ? mailIcon(false) : <Icons.Mail />,
                            text: printAnchorTag({
                                href: poi?.position?.mail,
                                label: poi?.position?.mail,
                                type: 'mail',
                            }),
                        });
                    }

                    if (poi.position?.website) {
                        infos.push({
                            icon: () =>
                                webIcon ? webIcon(false) : <Icons.Computer />,
                            text: printAnchorTag({
                                href: poi?.position?.website,
                                label: poi?.position?.website,
                                isExternal: true,
                            }),
                        });
                    }

                    return {
                        id: id.toString(),
                        name: poi.name,
                        description: poi.shortDescription,
                        position: [lat || 0, lng || 0],
                        facts: poi.facts
                            ?.filter((fact) => fact.name)
                            ?.map((fact) => fact.name!),

                        icon: markerSettings,
                        action:
                            action && isValidAction(primary_label, poi.alias)
                                ? action({
                                      label: primary_label,
                                      href: poi.alias,
                                      isExternal: isExternalLink(poi.alias),
                                  })
                                : undefined,
                        infos: infos,
                    };
                })}
            customFact={customFact}
            currentPosMarker={currentPosMarker}
            customCardClose={customCardClose}
            customLocationRequest={customLocationRequest}
        />
    );
};