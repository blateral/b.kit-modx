import { isValidArray } from '@blateral/b.kit';
import { AccordionSliceType, getAccordionSearchData } from 'slices/Accordion';
import { AlertListSliceType, getAlertListSearchData } from 'slices/AlertList';
import { ArticleSliceType, getArticleSearchData } from 'slices/Article';
import {
    CallToActionSliceType,
    getCallToActionSearchData,
} from 'slices/CallToAction';
import { getHeaderSearchData, HeaderSliceType } from 'slices/Header';
import { getIntroSearchData, IntroSliceType } from 'slices/Intro';
import { getNewsIntroSearchData, NewsIntroSliceType } from 'slices/News/Intro';
import { getNewsTextSearchData, NewsTextSliceType } from 'slices/News/Text';
import { getQuoteSearchData, QuoteSliceType } from 'slices/Quote';
import {
    isModxEventPage,
    isModxNewsPage,
    isModxPage,
    isModxPoiPage,
    ModxEventPage,
    ModxNewsPage,
    ModxPage,
    ModxPoiPage,
    NewsPageContent,
    PageContent,
} from './modx';

export interface SearchableData {
    name: string;
    data: string[];
}
export type ModxPageSearchConfig<
    Content extends
        | PageContent['slice_type']
        | string = PageContent['slice_type']
> = {
    [key in Content]: (slice: PageContent) => string[];
};

/**
 * Get searchable data for default MODX page
 * @param page ModxPage
 * @param config ModxPageSearchConfig
 * @returns
 */
export const getModxPageSearchData = (
    page?: ModxPage,
    config?: Partial<ModxPageSearchConfig>
): SearchableData[] => {
    const data: SearchableData[] = [];
    if (!page || !isModxPage(page)) return data;

    const sliceConfig: Partial<ModxPageSearchConfig> = {
        Intro: (slice) => getIntroSearchData(slice as IntroSliceType),
        Article: (slice) => getArticleSearchData(slice as ArticleSliceType),
        Header: (slice) => getHeaderSearchData(slice as HeaderSliceType),
        Accordion: (slice) =>
            getAccordionSearchData(slice as AccordionSliceType),
        CallToAction: (slice) =>
            getCallToActionSearchData(slice as CallToActionSliceType),
        Quote: (slice) => getQuoteSearchData(slice as QuoteSliceType),
        AlertList: (slice) =>
            getAlertListSearchData(slice as AlertListSliceType),
        ...config,
    };

    for (const slice of page.content) {
        const renderData = sliceConfig[slice.slice_type];
        if (!renderData) continue;

        data.push({
            name: slice.slice_type,
            data: renderData(slice),
        });
    }

    return data;
};

export type ModxNewsPageSearchConfig<
    Content extends
        | NewsPageContent['slice_type']
        | string = NewsPageContent['slice_type']
> = {
    [key in Content]: (slice: NewsPageContent) => string[];
};

/**
 * Get searchable data for news MODX page
 * @param page ModxNewsPage
 * @param config ModxNewsPageSearchConfig
 * @returns
 */
export const getModxNewsPageSearchData = (
    page?: ModxNewsPage,
    config?: Partial<ModxNewsPageSearchConfig>
): SearchableData[] => {
    const data: SearchableData[] = [];
    if (!page || !isModxNewsPage(page)) return data;

    const sliceConfig: Partial<ModxNewsPageSearchConfig> = {
        NewsIntro: (slice) =>
            getNewsIntroSearchData(slice as NewsIntroSliceType),
        NewsText: (slice) => getNewsTextSearchData(slice as NewsTextSliceType),
        ...config,
    };

    for (const slice of page.content) {
        const renderData = sliceConfig[slice.slice_type];
        if (!renderData) continue;

        data.push({
            name: slice.slice_type,
            data: renderData(slice),
        });
    }

    return data;
};

export type ModxEventPageSearchConfig<
    Content extends
        | PageContent['slice_type']
        | string = PageContent['slice_type']
> = {
    [key in Content]: (slice: PageContent) => string[];
};

/**
 * Get searchable data for event MODX page
 * @param page ModxEventPage
 * @param config ModxEventPageSearchConfig
 * @returns
 */
export const getModxEventPageSearchData = (
    page?: ModxEventPage,
    config?: Partial<ModxEventPageSearchConfig>
): SearchableData[] => {
    const data: SearchableData[] = [];
    if (!page || !isModxEventPage(page)) return data;

    // set searchable event data
    const event = page.eventData;
    const searchableEventData: string[] = [];
    if (event?.title) searchableEventData.push(event.title);
    if (event?.text) searchableEventData.push(event.text);

    if (isValidArray(searchableEventData, false)) {
        data.push({
            name: 'event_data',
            data: searchableEventData,
        });
    }

    // set additional contentblocks data
    const sliceConfig: Partial<ModxEventPageSearchConfig> = {
        Intro: (slice) => getIntroSearchData(slice as IntroSliceType),
        Article: (slice) => getArticleSearchData(slice as ArticleSliceType),
        Header: (slice) => getHeaderSearchData(slice as HeaderSliceType),
        Accordion: (slice) =>
            getAccordionSearchData(slice as AccordionSliceType),
        CallToAction: (slice) =>
            getCallToActionSearchData(slice as CallToActionSliceType),
        Quote: (slice) => getQuoteSearchData(slice as QuoteSliceType),
        AlertList: (slice) =>
            getAlertListSearchData(slice as AlertListSliceType),
        ...config,
    };

    for (const slice of page.content) {
        const renderData = sliceConfig[slice.slice_type];
        if (!renderData) continue;

        data.push({
            name: slice.slice_type,
            data: renderData(slice),
        });
    }
    return data;
};

export type ModxPoiPageSearchConfig<
    Content extends
        | PageContent['slice_type']
        | string = PageContent['slice_type']
> = {
    [key in Content]: (slice: PageContent) => string[];
};

/**
 * Get searchable data for POI MODX page
 * @param page ModxPoiPage
 * @param config ModxPoiPageSearchConfig
 * @returns
 */
export const getModxPoiPageSearchData = (
    page?: ModxPoiPage,
    config?: Partial<ModxPoiPageSearchConfig>
): SearchableData[] => {
    const data: SearchableData[] = [];
    if (!page || !isModxPoiPage(page)) return data;

    // set searchable POI data
    const poi = page.poiData;
    const searchablePoiData: string[] = [];
    if (poi?.name) searchablePoiData.push(poi.name);
    if (poi?.description) searchablePoiData.push(poi.description);

    if (isValidArray(searchablePoiData, false)) {
        data.push({
            name: 'poi_data',
            data: searchablePoiData,
        });
    }

    // set additional contentblocks data
    const sliceConfig: Partial<ModxPoiPageSearchConfig> = {
        Intro: (slice) => getIntroSearchData(slice as IntroSliceType),
        Article: (slice) => getArticleSearchData(slice as ArticleSliceType),
        Header: (slice) => getHeaderSearchData(slice as HeaderSliceType),
        Accordion: (slice) =>
            getAccordionSearchData(slice as AccordionSliceType),
        CallToAction: (slice) =>
            getCallToActionSearchData(slice as CallToActionSliceType),
        Quote: (slice) => getQuoteSearchData(slice as QuoteSliceType),
        AlertList: (slice) =>
            getAlertListSearchData(slice as AlertListSliceType),
        ...config,
    };

    for (const slice of page.content) {
        const renderData = sliceConfig[slice.slice_type];
        if (!renderData) continue;

        data.push({
            name: slice.slice_type,
            data: renderData(slice),
        });
    }
    return data;
};
