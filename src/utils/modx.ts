import { AccordionSliceType } from '../slices/Accordion';
import { ArticleSliceType } from '../slices/Article';
import { CallToActionSliceType } from '../slices/CallToAction';
import { ComparisonSliderSliceType } from '../slices/ComparisonSlider';
import { CrossPromotionListSliceType } from '../slices/CrossPromotionList';
import { FactGridSliceType } from '../slices/FactGrid';
import { FactListSliceType } from '../slices/FactList';
import { FeatureListSliceType } from '../slices/FeatureList';
import { GallerySliceType } from '../slices/Gallery';
import { HeaderSliceType } from 'slices/Header';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { IconListSliceType } from '../slices/IconList';
import { IntroSliceType } from '../slices/Intro';
import { MapSliceType } from '../slices/Map';
import { NewsImagesSliceType } from '../slices/News/Images';
import { NewsIntroSliceType } from '../slices/News/Intro';
import { NewsListSliceType } from '../slices/News/List';
import { NewsOverviewSliceType } from '../slices/News/Overview';
import { NewsTableSliceType } from '../slices/News/Table';
import { NewsTextSliceType } from '../slices/News/Text';
import { NewsVideoSliceType } from '../slices/News/Video';
import { PosterSliceType } from '../slices/Poster';
import { QuickNavSliceType } from '../slices/QuickNav';
import { TableSliceType } from '../slices/Table';
import { TeaserSliceType } from '../slices/Teaser';
import { VideoSliceType } from '../slices/Video';
import { SocialWallSliceType } from 'slices/SocialWall';
import { DynamicFormSliceType } from 'slices/DynamicForm';
import { QuoteSliceType } from 'slices/Quote';
import { AlertListSliceType } from 'slices/AlertList';
import { NavListSliceType } from 'slices/NavList';
import { CardListSliceType } from 'slices/CardList';
import { IndexListSliceType } from 'slices/IndexList';
import { EventListSliceType } from 'slices/EventList';
import { EventOverviewSliceType } from 'slices/Events/EventOverview';
import { LinkProps } from '@blateral/b.kit/lib/components/buttons/Button';
import { JobListSliceType } from 'slices/Jobs/JobList';
import {
    BottomLink,
    SiteLinkGroup,
} from '@blateral/b.kit/lib/components/sections/footer/Footer';
import { NavListAutoSliceType } from 'slices/NavListAuto';
import { NumberListSliceType } from 'slices/NumberList';
import { ParallaxBackgroundSliceType } from 'slices/ParallaxBackground';
import { PriceListSliceType } from 'slices/PriceList';
import { PriceTableSliceType } from 'slices/PriceTable';
import { SimpleImageSliceType } from 'slices/SimpleImage';
import { SocialNavSliceType } from 'slices/SocialNav';
import { TimelineSliceType } from 'slices/Timeline';
import { NewsAuthorCardSliceType } from 'slices/News/AuthorCard';
import { NewsFooterSliceType } from 'slices/News/Footer';
import { NewsletterFormSliceType } from 'slices/NewsletterForm';
import { PointOfInterestOverviewSliceType } from 'slices/POIs/PointOfInterestOverview';

export interface ModxConnectorConfig {
    endpoint: string;
}

export const initApi = (alias: string, config: ModxConnectorConfig) => {
    if (!config?.endpoint) throw new Error('No MODX endpoint defined!');
    return `${config.endpoint}${alias}`;
};

export const getPageData = async (
    query: string,
    config: ModxConnectorConfig
) => {
    const { pageData, statusCode } = await fetch(
        initApi(query as string, config)
    ).then(async (res) => {
        const pageData = await res.json();

        return {
            pageData: pageData,
            statusCode:
                res.redirected && query !== pageData.alias ? 301 : res.status,
        };
    });

    return {
        page: pageData,
        statusCode,
    };
};

export type BgMode = 'full' | 'splitted' | 'inverted' | undefined;

export interface ModxSlice<S, I = any> {
    slice_type: S;
    primary?: Record<string, unknown>;
    items: I[];
    config: ModxConnectorConfig;
}

export const getSettingsData = async (config: ModxConnectorConfig) => {
    const settingsData = await fetch(initApi('settings', config)).then((res) =>
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
    | AccordionSliceType
    | AlertListSliceType
    | ArticleSliceType
    | CallToActionSliceType
    | CardListSliceType
    | ComparisonSliderSliceType
    | CrossPromotionListSliceType
    | DynamicFormSliceType
    | NewsletterFormSliceType
    | EventListSliceType
    | EventOverviewSliceType
    | FactGridSliceType
    | FactListSliceType
    | FeatureListSliceType
    | GallerySliceType
    | HeaderSliceType
    | IconListSliceType
    | IndexListSliceType
    | IntroSliceType
    | JobListSliceType
    | MapSliceType
    | NavListSliceType
    | NavListAutoSliceType
    | NewsListSliceType
    | NewsOverviewSliceType
    | NumberListSliceType
    | ParallaxBackgroundSliceType
    | PosterSliceType
    | PriceListSliceType
    | PriceTableSliceType
    | QuickNavSliceType
    | QuickNavSliceType
    | QuoteSliceType
    | SimpleImageSliceType
    | SocialNavSliceType
    | SocialWallSliceType
    | TableSliceType
    | TeaserSliceType
    | TimelineSliceType
    | PointOfInterestOverviewSliceType
    | VideoSliceType;

export type NewsPageContent =
    | NewsAuthorCardSliceType
    | NewsFooterSliceType
    | NewsImagesSliceType
    | NewsIntroSliceType
    | NewsListSliceType
    | NewsTableSliceType
    | NewsTextSliceType
    | NewsVideoSliceType;

export type ModxDocument = {
    id: string;
    type: 'page' | 'event_page' | 'news_page';
    alias: string;
    breadcrumbTrail?: Array<BreadCrumb>;

    pagetitle?: string;
    ogImage?: ModxImageProps;
    seoDescription?: string;
    seoKeywords?: string;
    robots?: string;
    seoContentGroup?: string;
    seoRedirection?: string;

    // nav_isinverted?: boolean;
    // nav_withtopoffset?: boolean;
    // nav_menuicon?: string;
    // navbarAllowOverflow?: boolean;
    publication_date?: string;

    headScripts?: string;

    primary_link?: string;
    primary_label?: string;
    secondary_link?: string;
    secondary_label?: string;

    menuBreadcrumbs?: { link?: string; label: string }[];
    gTag?: string;

    settings?: ModxSettings;
    strucOrganization: StructuredOrganizationData;
};

export interface StructuredOrganizationData {
    '@context': string;
    '@type':
        | 'Organization'
        | 'Airline'
        | 'Consortium'
        | 'Corporation'
        | 'EducationalOrganization'
        | 'FundingScheme'
        | 'GovernmentOrganization'
        | 'LibrarySystem'
        | 'LocalBusiness'
        | 'MedicalOrganization'
        | 'NGO'
        | 'NewsMediaOrganization'
        | 'PerformingGroup'
        | 'Project'
        | 'ResearchOrganization'
        | 'SportsOrganization'
        | 'WorkersUnion';
    name: string;
    url: string;
    telephone: string;
    email: string;
    sameAs: string[];
    logo: string;
    address: {
        '@type': 'PostalAddress';
        streetAddress: string;
        addressLocality: string;
        postalCode: string;
        addressCountry: string;
    };
}
export interface ModxPage extends ModxDocument {
    header: HeaderSliceType;
    content: Array<PageContent>;
}

export interface ModxPoiPage extends ModxPage {
    poiData?: ModxPoiData;
}

export interface ModxPoiDataFact {
    MIGX_id?: string;
    name?: string;
}

export interface ModxPoiData {
    name?: string;
    description?: string;
    shortDescription?: string;
    image?: ModxImageProps & {
        ratios: {
            small: { w?: number; h?: number };
            medium: { w?: number; h?: number };
            large: { w?: number; h?: number };
        };
    };
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
    contact?: {
        name?: string;
        jobPosition?: string;
        street?: string;
        postalCode?: string;
        city?: string;
        phone?: string;
        mail?: string;
    };
    openingHours?: string;
    prices?: string;
    facts?: ModxPoiDataFact[];
}

export interface ModxEventPage extends ModxPage {
    eventData?: ModxEventData;
    tags?: string;
    eventCollectionUrl?: string;
    eventOverviewUrl?: string;
}

export interface ModxEventData {
    title?: string;
    date?: string;
    image: ModxImageProps & {
        ratios: {
            small: { w?: number; h?: number };
            medium: { w?: number; h?: number };
            large: { w?: number; h?: number };
        };
    };
    text?: string;
    duration?: string;
    price?: string;
    priceInfo?: string;
    address: {
        locationName?: string;
        street?: string;
        city?: string;
        zipcode?: string;
        email?: string;
        phone?: string;
        website?: string;
    };
    booking: {
        email?: string;
        phone?: string;
        info?: string;
        website?: string;
    };
    organizer: {
        phone?: string;
        email?: string;
        website?: string;
        info?: string;
    };
}

export interface SocialMediaItem {
    link?: string;
    icon?: Pick<ModxImageProps, 'small'>;
    'icon-inverted'?: Pick<ModxImageProps, 'small'>;
}

export interface NavBarProperties {
    isStickable?: boolean;
    isCollapsible?: boolean;
    pageFlow?: 'beforeContent' | 'overContent';
    navbarPrimary: {
        label?: string;
        labelShort?: string;
        link?: string;
        newTab?: boolean;
    };
    navbarSecondary: {
        label?: string;
        labelShort?: string;
        link?: string;
        newTab?: boolean;
    };
}

export interface BreadCrumb {
    link?: LinkProps;
    label?: string;
    uid?: string;
    isCurrent?: boolean;
}
export interface ModxSettings extends ModxPage {
    menu: ModxMenuItemData;
    navBar: NavBarProperties;
    flyoutMenu: ModxFlyoutMenu;

    cookie: {
        title?: string;
        text?: string;
        acceptanceLabel?: string;
        declineLabel?: string;
        icon?: ModxImageProps;
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
    socials?: SocialMediaItem[];

    logo?: {
        desktop?: string;
        link?: string;
        inverted: string;
        smallLogo: string;
        smallLogoInverted: string;
        footerLogo: string;
        alt?: string;
    };

    webcamLink?: string;

    webcam?: {
        link: string;
        label: string;
    };

    newsletter?: {
        successLink?: string;
        link?: string;
        text?: string;
        title?: string;
        label?: string;
        placeholder?: string;
    };

    footer?: {
        note?: string;
        bgMode?: 'full' | 'inverted';
    };

    headerPrimary: {
        label: string;
        link: string;
        newTab: boolean;
    };
    headerSecondary: {
        label: string;
        link: string;
        newTab: boolean;
    };
}

export interface ModxJobPage extends ModxDocument {
    jobCollectionUrl?: string;
    jobOverviewUrl?: string;
    jobData?: ModxJobData;
    publishedOn?: string;
}

export interface ModxJobLocation {
    id?: number;
    title?: string;
    description?: string;
    addressLocality?: string;
    streetAddress?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
}

export interface ModxJobData {
    locations?: Array<ModxJobLocation>;
    totalLocations?: number;
    allLocationsLabel?: string;
    timeModels?: Array<{
        name: string;
        type: string;
    }>;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionLink?: string;
}

export interface ModxNewsPage extends ModxDocument {
    newsCollectionUrl?: string;
    tags?: string;
    newsImage?: ModxImageProps;
    newsImagePreview?: ModxImageProps;

    newsItems?: Array<ModxNewsTeaser>;
    newsHeading?: string;
    newsIntro?: string;
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

    content: Array<NewsPageContent>;
}

export interface ModxNewsData extends ModxDocument {
    newsAlias?: string;
    newsOverviewUrl?: string;
    newsArticles?: ModxNewsTeaser[];
}
export interface ModxNewsTeaser {
    id: string;
    label?: string;
    link?: string;
    alias?: string;
    publishedOn?: string;
    tags?: string;
    readMeLabel?: string;
    author?: {
        name?: string;
        image?: {
            small?: string;
            meta?: ModxImageMetaData;
        };
    };
    intro?: {
        image?: {
            small?: string;
            medium?: string;
            semilarge?: string;
            meta?: ModxImageMetaData;
        };
        image_preview?: {
            small?: string;
            medium?: string;
            large?: string;
            xlarge?: string;
            ratios: {
                small: {
                    w: number;
                    h: number;
                };
            };
            meta?: ModxImageMetaData;
        };
        title?: string;
        text?: string;
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

export type ModxFlyoutMenu = {
    isInverted?: boolean;
    isLarge?: boolean;
    isMirrored?: boolean;
};

export type ModxNavItem = {
    id: string;
    alias?: string;
    link?: string;
    navGroupLabel?: string;
    label?: string;
    active?: boolean;
    isSmall?: boolean;
    items: Array<ModxNavItem>;
};

// NEW
export type ModxNavGroup = {
    id: string;
    alias?: string;
    link?: {
        href: string;
    };
    label?: string;
    isFeatured?: boolean;
    isCurrent?: boolean;
    subItems: Array<ModxNavGroup>;
    icon?: string;
};

export type ModxMenuItemData = {
    type?: 'flyout' | 'large';
    primaryMenu: Array<ModxNavGroup>;
    secondaryMenu: Array<ModxNavGroup>;

    navBarTopMenu: Array<ModxNavGroup>;

    footerMenus: Array<SiteLinkGroup>;
    bottomLinksLeft: Array<BottomLink>;
    bottomLinksRight: Array<BottomLink>;

    menuCompanyTitle: string;
    menuCompany: Array<{
        id: string;
        link: string;
        label: string;
        active?: boolean;
    }>;
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
    meta?: ModxImageMetaData;
}

export interface ModxComponentDataType extends ModxImageProps {
    small: string;
    alt: string;
}

export function isBgModeString(toCheck?: string): toCheck is BgMode {
    return (
        !toCheck ||
        toCheck === 'full' ||
        toCheck === 'splitted' ||
        toCheck === 'inverted'
    );
}

export const mapImageToComponentData = (
    image?: ModxImageProps
): ModxComponentDataType | { small: string } => {
    if (!image) return { small: '' };
    return {
        ...image,
        small: image?.small || '',
        alt: image?.meta?.altText || '',
    };
};

export type SizeSelect = 'full' | 'small' | undefined;
export function isSizeSelectString(toCheck?: string): toCheck is SizeSelect {
    return !toCheck || toCheck === 'full' || toCheck === 'small';
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
    return !!(label && link);
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

export const isModxPage = (pageToCheck: any): pageToCheck is ModxPage => {
    return pageToCheck?.type === 'page';
};

export const isModxNewsPage = (
    pageToCheck: any
): pageToCheck is ModxNewsPage => {
    return pageToCheck?.type === 'news_page';
};

export const isModxEventPage = (
    pageToCheck: any
): pageToCheck is ModxEventPage => {
    return pageToCheck?.type === 'event_page';
};

export const isModxJobPage = (
    pageToCheck: any
): pageToCheck is ModxEventPage => {
    return pageToCheck?.type === 'job_page';
};

export const isModxPoiPage = (pageToCheck: any): pageToCheck is ModxPoiPage => {
    return pageToCheck?.type === 'poi_page';
};
