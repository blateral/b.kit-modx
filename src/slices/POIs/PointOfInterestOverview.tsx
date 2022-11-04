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

const poiSortFn = (a: PointOfInterest, b: PointOfInterest) => {
    if (!a.name || !b.name) return 0;

    return a.name.localeCompare(b.name);
};

export interface PointOfInterestOverviewSliceType
    extends ModxSlice<'POIOverview'> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: 'full' | 'inverted';
    enableFiltering?: boolean;
    filterPlaceholder?: string;
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
    enableFiltering,
    primary_label,
    collection,
    filterPlaceholder,
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
            enableFiltering={enableFiltering}
            filterPlaceholder={filterPlaceholder}
            pois={collection?.pois?.sort(poiSortFn).map((poi, i) => {
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
                        icon: (isInverted) =>
                            locationIcon ? (
                                locationIcon(isInverted)
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
                        icon: (isInverted) =>
                            mapIcon ? mapIcon(isInverted) : <Icons.Map />,
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
                            phoneIcon ? phoneIcon(isInverted) : <Icons.Phone />,
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
                            mailIcon ? mailIcon(isInverted) : <Icons.Mail />,
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
                            webIcon ? webIcon(isInverted) : <Icons.Computer />,
                        text: printAnchorTag({
                            href: poi?.position?.website,
                            label: poi?.position?.website,
                            isExternal: true,
                        }),
                    });
                }

                return {
                    id: id.toString(),
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
