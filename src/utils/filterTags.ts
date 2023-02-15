import { isValidArray } from '@blateral/b.kit/hooks';

export const getFilterTagsArray = (filter?: string) => {
    let tags: string[] = [];
    if (!filter) return tags;

    const encodedFilter = decodeURIComponent(filter);
    const filterParts = encodedFilter.split(',');

    if (isValidArray(filterParts, false)) {
        tags = filterParts;
    }

    return tags;
};
