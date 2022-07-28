import React from 'react';
import {
    assignTo,
    PointOfInterestOverview,
    ThemeMods,
    Icons,
    concat,
    printAnchorTag,
} from '@blateral/b.kit';
import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { getGoogleMapsURL } from 'utils/googleMaps';
import { Info } from '@blateral/b.kit/lib/components/blocks/InfoList';

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

export interface PointOfInterestOverviewSliceType
    extends ModxSlice<'POIOverview'> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    primary_label?: string;
    collection?: POICollection;

    customFact?: (props: {
        key: React.Key;
        name: string;
        isInverted?: boolean;
    }) => React.ReactNode;
    action?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    locationIcon?: (isInverted?: boolean) => React.ReactNode;
    mapIcon?: (isInverted?: boolean) => React.ReactNode;
    phoneIcon?: (isInverted?: boolean) => React.ReactNode;
    mailIcon?: (isInverted?: boolean) => React.ReactNode;
    webIcon?: (isInverted?: boolean) => React.ReactNode;

    theme?: ThemeMods;
}

export const PointOfInterestOverviewSlice: React.FC<
    PointOfInterestOverviewSliceType
> = ({
    bgMode,
    anchorId,
    primary_label,
    collection,
    bgColor,
    theme,
    customFact,
    action,
    locationIcon,
    mapIcon,
    phoneIcon,
    mailIcon,
    webIcon,
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

    return (
        <PointOfInterestOverview
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            pois={collection?.pois?.map((poi) => {
                const infos: Info[] = [];

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
                        icon: (isInverted) =>
                            locationIcon ? (
                                locationIcon(isInverted)
                            ) : (
                                <div style={{ paddingTop: '3px' }}>
                                    <Icons.LocationPin />
                                </div>
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
                        icon: (isInverted) =>
                            mapIcon ? (
                                mapIcon(isInverted)
                            ) : (
                                <div style={{ paddingTop: '6px' }}>
                                    <Icons.Map />
                                </div>
                            ),
                        text: printAnchorTag({
                            href: getGoogleMapsURL(searchQuery) || '',
                            isExternal: true,
                            label: 'Auf Karte anzeigen',
                        }),
                    });
                }

                if (poi.position?.phone) {
                    infos.push({
                        icon: (isInverted) =>
                            phoneIcon ? (
                                phoneIcon(isInverted)
                            ) : (
                                <div style={{ paddingTop: '6px' }}>
                                    <Icons.Phone />
                                </div>
                            ),
                        text: printAnchorTag({
                            href: poi?.position?.phone,
                            label: poi?.position?.phone,
                            type: 'phone',
                        }),
                    });
                }

                if (poi.position?.mail) {
                    infos.push({
                        icon: (isInverted) =>
                            mailIcon ? (
                                mailIcon(isInverted)
                            ) : (
                                <div style={{ paddingTop: '3px' }}>
                                    <Icons.Mail />
                                </div>
                            ),
                        text: printAnchorTag({
                            href: poi?.position?.mail,
                            label: poi?.position?.mail,
                            type: 'mail',
                        }),
                    });
                }

                if (poi.position?.website) {
                    infos.push({
                        icon: (isInverted) =>
                            webIcon ? (
                                webIcon(isInverted)
                            ) : (
                                <div style={{ paddingTop: '6px' }}>
                                    <Icons.Computer />
                                </div>
                            ),
                        text: printAnchorTag({
                            href: poi?.position?.website,
                            label: poi?.position?.website,
                            isExternal: true,
                        }),
                    });
                }

                return {
                    name: poi.name || '',
                    shortDescription: poi.shortDescription,
                    facts: poi.facts
                        ?.filter((fact) => fact.name)
                        ?.map((fact) => fact.name!),
                    customFact: customFact,
                    action:
                        action && isValidAction(primary_label, poi.alias)
                            ? (isInverted) =>
                                  action({
                                      isInverted,
                                      label: primary_label,
                                      href: poi.alias,
                                      isExternal: isExternalLink(poi.alias),
                                  })
                            : undefined,
                    infos: infos,
                };
            })}
        />
    );
};
