import { ArticleSliceType } from '../slices/Article';
import { CallToActionSliceType } from '../slices/CallToAction';
import { CrossPromotionListSliceType } from '../slices/CrossPromotionList';
import { FactListSliceType } from '../slices/FactList';
import { FactGridSliceType } from '../slices/FactGrid';
import { FeatureListSliceType } from '../slices/FeatureList';
import { GallerySliceType } from '../slices/Gallery';
import { HeaderSliceType } from '../slices/Header';
import { IconListSliceType } from '../slices/IconList';
import { MapSliceType } from '../slices/Map';
import { PosterSliceType } from '../slices/Poster';
import { TableSliceType } from '../slices/Table';
import { TeaserSliceType } from '../slices/Teaser';
import { VideoSliceType } from '../slices/Video';
import { FormSliceType } from '../slices/Form';
import { ComparisonSliderSliceType } from '../slices/ComparisonSlider';
import { NewsTextSliceType } from '../slices/News/Text';
import { NewsTableSliceType } from '../slices/News/Table';
import { NewsIntroSliceType } from '../slices/News/Intro';
import { NewsVideoSliceType } from '../slices/News/Video';
import { NewsListSliceType } from '../slices/News/List';
import { NewsImagesSliceType } from '../slices/News/Images';
import { NewsOverviewSliceType } from '../slices/News/Overview';
import { IntroSliceType } from '../slices/Intro';
import { AccordionSliceType } from '../slices/Accordion';
import { QuickNavSliceType } from '../slices/QuickNav';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

export const endpoint = 'https://cms.ueberlingen-bodensee.de/';
export const initApi = (alias: string) => {
    return `${endpoint}${alias}`;
};

export const getPageData = async (query: string) => {
    const { pageData, statusCode } = await fetch(initApi(query as string)).then(
        async (res) => {
            const pageData = await res.json();

            return {
                pageData: pageData,
                statusCode:
                    res.redirected && query !== pageData.alias
                        ? 301
                        : res.status,
            };
        }
    );

    return {
        page: pageData,
        statusCode,
    };
};

export type BgMode = 'full' | 'splitted' | 'inverted' | undefined;

export interface ModxSlice<S, I = any> {
    slice_type: S;
    primary: Record<string, unknown>;
    items: I[];
}

export const getSettingsData = async () => {
    const settingsData = await fetch(initApi('settings')).then((res) =>
        res.json()
    );
    return {
        settings: settingsData,
    };
};

export interface SitemapItem {
    alias: string;
    lastmod: string;
    changeFreq: string;
    priority: string;
    useInSitemap: boolean;
    useInSearch: boolean;
    indexed: string;
}

export type PageContent =
    | ArticleSliceType
    | GallerySliceType
    | FeatureListSliceType
    | VideoSliceType
    | PosterSliceType
    | FactListSliceType
    | FactGridSliceType
    | IconListSliceType
    | HeaderSliceType
    | TeaserSliceType
    | MapSliceType
    | CallToActionSliceType
    | CrossPromotionListSliceType
    | ComparisonSliderSliceType
    | TableSliceType
    | FormSliceType
    | NewsListSliceType
    | NewsOverviewSliceType
    | IntroSliceType
    | AccordionSliceType
    | QuickNavSliceType;

export type ModxDocument = {
    id: string;
    pagetitle?: string;
    seo_socialimage?: ModxImageProps;
    seo_description?: string;
    seo_keywords?: string;
    seo_search_index?: boolean;
    seo_trace_links?: boolean;
    seo_content_group?: string;
    seo_redirection?: string;

    nav_isinverted?: boolean;
    nav_withtopoffset?: boolean;
    nav_menuicon?: string;

    nav_allowtopbaroverflow?: boolean;
    publication_date?: string;

    primary_link?: string;
    primary_label?: string;
    secondary_link?: string;
    secondary_label?: string;

    menuBreadcrumbs?: { link?: string; label: string }[];
    gTag?: string;
};

export interface ModxPage extends ModxDocument {
    type: 'page';
    content: PageContent;
}

export interface PrismicNewsPage extends ModxDocument {
    data: {
        id: string;
        pagetitle?: string;
        seo_socialimage?: ModxImageProps;
        seo_description?: string;
        seo_keywords?: string;
        seo_search_index?: boolean;
        seo_trace_links?: boolean;
        seo_content_group?: string;
        seo_redirection?: string;

        nav_isinverted?: boolean;
        nav_withtopoffset?: boolean;
        nav_menuicon?: string;

        nav_allowtopbaroverflow?: boolean;

        news_image?: ModxImageProps;
        news_heading?: string;
        news_intro?: string;
        news_footer_inverted?: boolean;
        news_footer_background?: boolean;

        publication_date?: string;

        primary_link?: string;
        primary_label?: string;
        secondary_link?: string;
        secondary_label?: string;

        author_label?: string;
        author_name?: string;
        author_image?: ModxImageProps;
        author_has_background?: boolean;
        author_is_inverted?: boolean;

        body: Array<
            | NewsTextSliceType
            | NewsTableSliceType
            | NewsIntroSliceType
            | NewsVideoSliceType
            | NewsImagesSliceType
        >;
    };
}

export const hasGTag = (data: any): data is { gTag: string } => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'gTag' in data &&
        typeof data.gTag === 'string'
    );
};

export type ModxSettingsData = {
    menuPrimary: Array<{
        id: string;
        link?: string;
        label: string;
        active?: boolean;
        items: Array<{
            id: string;
            link: string;
            label: string;
            active?: boolean;
        }>;
    }>;

    menuSecondary: Array<{
        id: string;
        link: string;
        label: string;
        active?: boolean;
    }>;

    menuQuicklinksTitle: string;
    menuQuicklinks: Array<{
        id: string;
        link: string;
        label: string;
        active?: boolean;
    }>;

    menuCompanyTitle: string;
    menuCompany: Array<{
        id: string;
        link: string;
        label: string;
        active?: boolean;
    }>;

    addressTitle: string;
    address: string;

    cookie: {
        title?: string;
        text?: string;
    };
    notification?: {
        title?: string;
        text?: string;
        triggerLabel?: string;
        action?: {
            link: string;
            label: string;
            newTab?: boolean;
        };
    };

    webcamLink?: string;

    webcam?: {
        link: string;
        label: string;
    };
};

export interface ModxImageProps {
    small: string;
    medium?: string;
    semilarge?: string;
    large?: string;
    xlarge?: string;
    meta?: ModxImageMetaData;
}

export interface ModxImageMetaData {
    copyright?: string;
    altText?: string;
}

export interface ModxImagePropsWithFormat {
    square?: Omit<ModxImageProps, 'meta'>;
    landscape?: Omit<ModxImageProps, 'meta'>;
    'landscape-wide'?: Omit<ModxImageProps, 'meta'>;
    portrait?: Omit<ModxImageProps, 'meta'>;
    meta?: Omit<ModxImageProps, 'meta'>;
}

export function isBgModeString(toCheck?: string): toCheck is BgMode {
    return (
        !toCheck ||
        toCheck === 'full' ||
        toCheck === 'splitted' ||
        toCheck === 'inverted'
    );
}
export function isHeadlineTag(tagString?: string): tagString is HeadlineTag {
    switch (tagString) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'span':
        case 'div':
            return true;
        default:
            return false;
    }
}

export const isValidAction = (label?: string, link?: string) => {
    return label && link;
};

export const isExternalLink = (link?: string) => {
    if (!link) return false;

    if (link.indexOf('http://') !== -1 || link.indexOf('https://') !== -1) {
        return true;
    } else {
        return false;
    }
};

export function isNumeric(str?: string) {
    if (typeof str != 'string') return false; // we only process strings!
    return /^\d+$/.test(str);
}

