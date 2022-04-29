import React from 'react';
import { assignTo, JobList, ThemeMods } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { JobItem } from '@blateral/b.kit/lib/components/sections/JobList';

interface JobListItems {
    jobTitle?: string;
    jobTimeModel?: string;
    jobLocation?: string;
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
    modelIcon?: () => React.ReactNode;
    /** Injection function for job location icon */
    locationIcon?: () => React.ReactNode;

    theme?: ThemeMods;
}

export const JobListSlice: React.FC<JobListSliceType> = ({
    bgMode,
    bgColor,
    anchorId,
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
                        location: job.jobLocation || '',
                        timeModel: job.jobTimeModel || '',
                        link: job.link || undefined,
                    };
                })}
        />
    );
};
