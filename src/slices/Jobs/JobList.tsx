import React from 'react';
import { assignTo, JobList, ThemeMods } from '@blateral/b.kit';
import { ModxJobLocation, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { JobItem } from '@blateral/b.kit/lib/components/sections/jobs/JobList';
import { StructuredEmploymentType } from '@blateral/b.kit/lib/utils/structuredData';
import { JobLocation } from '@blateral/b.kit/lib/components/blocks/JobCard';

interface JobListItems {
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

    totalJobLocations?: number;
    allJobLocationsLabel?: string;

    modelIcon?: () => React.ReactNode;
    /** Injection function for job location icon */
    locationIcon?: () => React.ReactNode;

    theme?: ThemeMods;
}

export const JobListSlice: React.FC<JobListSliceType> = ({
    bgMode,
    bgColor,
    anchorId,
    totalJobLocations,
    allJobLocationsLabel,
    items,
    modelIcon,
    locationIcon,
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

    return (
        <JobList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            locationIcon={locationIcon}
            modelIcon={modelIcon}
            bgMode={bgMode}
            jobs={items
                .filter((job) => job.jobTitle)
                .map<JobItem>((job) => {
                    return {
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
            totalJobLocations={totalJobLocations}
            allJobLocationsLabel={allJobLocationsLabel}
        />
    );
};
