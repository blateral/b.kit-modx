import React, { lazy } from 'react';
import { assignTo, ThemeMods, useLibTheme } from '@blateral/b.kit';
import { concat, printAnchorTag } from '@blateral/b.kit/hooks';
import * as Icons from '@blateral/b.kit/icons';
import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { getGoogleMapsURL } from 'utils/googleMaps';
import { Info } from '@blateral/b.kit/types/components/blocks/InfoList';

const PointOfInterestOverview = lazy(
    () => import('imports/POIs/PointOfInterestOverview')
);

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

        /** @deprecated */
        mail?: string;
        /** @deprecated */
        phone?: string;
        /** @deprecated */
        website?: string;
    };
    mail?: string;
    phone?: string;
    website?: string;
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

    /** Injection function for filter submit icon */
    filterSubmitIcon?: (isInverted?: boolean) => React.ReactNode;

    /** Injection function for filter reset icon */
    filterClearIcon?: (isInverted?: boolean) => React.ReactNode;

    queryParams?: Record<string, any>;
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
    filterSubmitIcon,
    filterClearIcon,
    queryParams,
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
        .poiFilterName;

    const initalFilterQuery = queryParams?.[filterName]
        ? decodeURIComponent(queryParams?.[filterName])
        : '';

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
                if (lat !== undefined && lng !== undefined) {
                    searchQuery = concat([lat, lng], ',');
                } else if (streetAndNumber && city) {
                    searchQuery = concat([streetAndNumber, city], ', ');
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

                const phone = poi.phone || poi.position?.phone;
                if (phone) {
                    infos.push({
                        icon: (isInverted) =>
                            phoneIcon ? phoneIcon(isInverted) : <Icons.Phone />,
                        text: printAnchorTag({
                            href: phone,
                            label: phone,
                            type: 'phone',
                        }),
                    });
                }

                const mail = poi.mail || poi.position?.mail;
                if (mail) {
                    infos.push({
                        icon: (isInverted) =>
                            mailIcon ? mailIcon(isInverted) : <Icons.Mail />,
                        text: printAnchorTag({
                            href: mail,
                            label: mail,
                            type: 'mail',
                        }),
                    });
                }

                const website = poi.website || poi.position?.website;
                if (website) {
                    infos.push({
                        icon: (isInverted) =>
                            webIcon ? webIcon(isInverted) : <Icons.Computer />,
                        text: printAnchorTag({
                            href: website,
                            label: website,
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
            initialFilterQuery={initalFilterQuery}
            filterSubmitIcon={filterSubmitIcon}
            filterClearIcon={filterClearIcon}
        />
    );
};
