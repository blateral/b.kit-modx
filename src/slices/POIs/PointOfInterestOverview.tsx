import React from 'react';
import { assignTo, ThemeMods, useLibTheme } from '@blateral/b.kit';
import { Icons } from '@blateral/b.kit/lib/icons';
import { concat, printAnchorTag } from '@blateral/b.kit/lib/hooks';

import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { getGoogleMapsURL } from 'utils/googleMaps';
import { Info } from '@blateral/b.kit/types/components/blocks/InfoList';
import { FilterState } from '@blateral/b.kit/types/components/blocks/FilterBar';
import {
    PointOfInterestOverviewItem,
    PoiOverviewFilters,
} from '@blateral/b.kit/types/components/sections/pois/PointOfInterestOverview';

const PointOfInterestOverview = React.lazy(
    () => import('imports/POIs/_PointOfInterestOverview')
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
    btnSubpage?: string;
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

    enableFiltering?: boolean;

    /** @deprecated */
    filterPlaceholder?: string;

    /** POI filter settings */
    poiFilters?: PoiOverviewFilters;
    customPoiFilters?: (props: {
        pois: PointOfInterestOverviewItem[];
        filters: FilterState;
        setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
        settings?: PoiOverviewFilters;
    }) => React.ReactNode;

    queryParams?: Record<string, any>;
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
    enableFiltering,
    filterPlaceholder,
    poiFilters,
    customPoiFilters,
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
    const factsFilterName = assignTo(parentTheme, sliceTheme).globals.sections
        .poiFactFilterName;

    const initalFilterQuery = queryParams?.[filterName]
        ? decodeURIComponent(queryParams?.[filterName])
        : '';

    const initalFactsFilterQuery = queryParams?.[factsFilterName]
        ? decodeURIComponent(queryParams?.[factsFilterName])?.split(',')
        : [];

    if (enableFiltering && filterPlaceholder) {
        console.warn(
            'filterPlaceholder is deprecated. Please use poiFilters.textFilter.placeholder instead.'
        );
    }

    return (
        <PointOfInterestOverview
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
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

                const hasDetailPageLink =
                    poi.btnSubpage === 'TRUE' &&
                    action &&
                    isValidAction(primary_label, poi.alias);

                return {
                    id: id.toString(),
                    name: poi.name || '',
                    shortDescription: poi.shortDescription,
                    facts: poi.facts
                        ?.filter((fact) => fact.name)
                        ?.map((fact) => fact.name!),
                    customFact: customFact,
                    action: hasDetailPageLink
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
            poiFilters={
                enableFiltering
                    ? {
                          textFilter: {
                              placeholder: filterPlaceholder,
                          },
                          categoryFilter: {},
                          ...(poiFilters || {}),
                      }
                    : undefined
            }
            initialPoiFilters={{
                textFilter: initalFilterQuery,
                categoryFilter: initalFactsFilterQuery,
            }}
            customPoiFilters={customPoiFilters}
        />
    );
};
