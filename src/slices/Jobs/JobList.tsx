import React from 'react';
import { assignTo, JobList, ThemeMods, useLibTheme } from '@blateral/b.kit';
import { ModxJobLocation, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { JobItem } from '@blateral/b.kit/lib/components/sections/jobs/JobList';
import { StructuredEmploymentType } from '@blateral/b.kit/lib/utils/structuredData';
import { JobLocation } from '@blateral/b.kit/lib/components/blocks/JobCard';

interface JobListItems {
    id: number;
    jobTitle?: string;
    jobTimeModels?: Array<{
        name: string;
        type: string;
    }>;
    jobLocations?: Array<ModxJobLocation>;
    link?: {
        href?: string;
        isExternal?: boolean;
    };
}

export interface JobListSliceType extends ModxSlice<'JobList', JobListItems> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    anchorId?: string;

    hasFilter?: boolean;
    filterPlaceholder?: string;

    totalJobLocations?: number;
    allJobLocationsLabel?: string;

    modelIcon?: () => React.ReactNode;

    /** Injection function for job location icon */
    locationIcon?: () => React.ReactNode;

    /** Injection function for filter submit icon */
    filterSubmitIcon?: (isInverted?: boolean) => React.ReactNode;

    /** Injection function for filter reset icon */
    filterClearIcon?: (isInverted?: boolean) => React.ReactNode;

    queryParams?: Record<string, any>;
    theme?: ThemeMods;
}

export const JobListSlice: React.FC<JobListSliceType> = ({
    bgMode,
    bgColor,
    anchorId,
    hasFilter,
    filterPlaceholder,
    totalJobLocations,
    allJobLocationsLabel,
    items,
    modelIcon,
    locationIcon,
    filterSubmitIcon,
    filterClearIcon,
    queryParams,
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

    // get new theme (parent theme + sliceTheme) that is also used inside NewsOverview component
    const { theme: parentTheme } = useLibTheme();
    const filterName = assignTo(parentTheme, sliceTheme).globals.sections
        .jobFilterName;

    const initalFilterQuery = queryParams?.[filterName]
        ? decodeURIComponent(queryParams?.[filterName])
        : '';

    return (
        <JobList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            locationIcon={locationIcon}
            modelIcon={modelIcon}
            bgMode={bgMode}
            jobs={items
                .filter((job) => job.jobTitle)
                .map<JobItem>((job, i) => {
                    const id = job.id !== undefined ? job.id : i;

                    return {
                        id: id.toString(),
                        jobTitle: job.jobTitle || '',
                        locations: job.jobLocations?.map<JobLocation>(
                            (loc) => ({
                                name: loc.title,
                                description: loc.description,
                                addressCountry: loc.addressCountry,
                                addressLocality: loc.addressLocality,
                                addressRegion: loc.addressRegion,
                                postalCode: loc.postalCode,
                                streetAddress: loc.streetAddress,
                            })
                        ),
                        employmentTypes: job.jobTimeModels?.map((model) => ({
                            name: model.name,
                            type: model.type as StructuredEmploymentType,
                        })),

                        link: job.link || undefined,
                    };
                })}
            hasFilter={hasFilter}
            initialFilterQuery={initalFilterQuery}
            filterPlaceholder={filterPlaceholder}
            totalJobLocations={totalJobLocations}
            allJobLocationsLabel={allJobLocationsLabel}
            filterSubmitIcon={filterSubmitIcon}
            filterClearIcon={filterClearIcon}
        />
    );
};
