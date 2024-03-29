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
import { HeadlineTag } from '@blateral/b.kit/types/components/typography/Heading';
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
import { EventListSliceType } from 'slices/Events/EventList';
import { EventOverviewSliceType } from 'slices/Events/EventOverview';
import { LinkProps } from '@blateral/b.kit/types/components/buttons/Button';
import { JobListSliceType } from 'slices/Jobs/JobList';
import {
    BottomLink,
    SiteLinkGroup,
} from '@blateral/b.kit/types/components/sections/footer/Footer';
import { NavListAutoSliceType } from 'slices/NavListAuto';
import { NumberListSliceType } from 'slices/NumberList';
import { ParallaxBackgroundSliceType } from 'slices/ParallaxBackground';
import { PriceListSliceType } from 'slices/PriceList';
import { PriceTableSliceType } from 'slices/PriceTable';
import { SimpleImageSliceType } from 'slices/SimpleImage';
import { TimelineSliceType } from 'slices/Timeline';
import { NewsAuthorCardSliceType } from 'slices/News/AuthorCard';
import { NewsFooterSliceType } from 'slices/News/Footer';
import { NewsletterFormSliceType } from 'slices/NewsletterForm';
import { PointOfInterestOverviewSliceType } from 'slices/POIs/PointOfInterestOverview';
import { PointOfInterestMapSliceType } from 'slices/POIs/PointOfInterestMap';
import { RawVideoSliceType } from 'slices/RawVideo';
import { CookieTypes } from '@blateral/b.kit/types/utils/cookie-consent/useCookieConsent';
import { NewsletterFormStructure } from '@blateral/b.kit/types/components/sections/NewsletterForm';
import { Language } from '@blateral/b.kit/types/components/blocks/LanguageSwitcher';
import { HtmlCodeSliceType } from 'slices/HtmlCode';

export interface ModxConnectorConfig {
    endpoint: string;
}

export const initApi = (alias: string, config: ModxConnectorConfig) => {
    if (!config?.endpoint) throw new Error('No MODX endpoint defined!');
    const endpoint = new URL(alias, config.endpoint);

    return endpoint.href;
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
    items?: I[];
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
    | QuoteSliceType
    | SimpleImageSliceType
    | SocialWallSliceType
    | TableSliceType
    | TeaserSliceType
    | TimelineSliceType
    | PointOfInterestOverviewSliceType
    | PointOfInterestMapSliceType
    | HtmlCodeSliceType
    | VideoSliceType
    | RawVideoSliceType;

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
    id: number;
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
    /** @deprecated */
    image?: ModxImageProps;
    images?: ModxImageProps[];
    shortDescription?: string;
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
        /** @deprecated */
        adress?: string;
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
    /** @deprecated */
    pageFlow?: 'beforeContent' | 'overContent';
    allowNavbarHeaderOverflow?: boolean;
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
    siteName: string;

    cookie: {
        title?: string;
        text?: string;
        acceptanceLabel?: string;
        declineLabel?: string;
        icon?: ModxImageProps;
        whitelist?: string[];
        typeSelectTitle?: string;
        cookieTypes?: string;
        videoCookieTypeRestrictions?: string[];
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

    socialsTitle?: string;
    socials?: SocialMediaItem[];

    langs: {
        [key: string]: {
            isCurrent: true;
            alias: string;
            label?: string;
        };
    };

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

export interface ModxJobPage extends ModxPage {
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
    shortDescription?: string;
    description?: string;
    actionLabel?: string;
    actionLink?: string;
}

export interface ModxNewsPage extends ModxDocument {
    newsCollectionUrl?: string;
    newsOverviewUrl?: string;
    tags?: string;
    name?: string;
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

export const parseModxDateString = (modxDateString?: string) => {
    if (!modxDateString) return undefined;

    // "2022-04-21 14:15:00"
    try {
        const dateParts = modxDateString.split(' ');

        const dateSnippets = dateParts[0].split('-');

        let timeSnippets: string[] = [];
        if (dateParts.length > 1) {
            timeSnippets = dateParts[1].split(':');
        }
        const hasTimeSnippets = timeSnippets.length > 0;

        const year = +dateSnippets[0];
        const month = +dateSnippets[1] - 1 < 0 ? 0 : +dateSnippets[1] - 1;
        const day = +dateSnippets[2];

        return new Date(
            year,
            month,
            day,
            hasTimeSnippets ? +timeSnippets[0] : undefined,
            hasTimeSnippets ? +timeSnippets[1] : undefined,
            hasTimeSnippets ? +timeSnippets[2] : undefined
        );
    } catch (e) {
        console.error('Error: Generating date item failed');

        return new Date(1970, 1, 1);
    }
};

export const parseModxCookieTypes = (
    modxTypesString?: string
): CookieTypes | undefined => {
    try {
        if (!modxTypesString) {
            throw new Error('Undefined cookie types settings input');
        }

        const types: CookieTypes = JSON.parse(modxTypesString);
        if (!types || typeof types !== 'object') {
            throw new Error('Cannot parse cookie types settings from MODX');
        }

        return types;
    } catch (err) {
        return undefined;
    }
};

export const parseModxLangs = (
    settings: ModxSettings,
    useLabels = false
): Language[] => {
    if (!settings || !settings.langs) return [];

    const keys = Object.keys(settings.langs);
    return keys.map((key) => ({
        isActive: settings.langs[key].isCurrent,
        label: useLabels
            ? settings.langs[key].label || key.toUpperCase()
            : key.toUpperCase(),
        link: {
            href: settings.langs[key].alias,
        },
    })) as Language[];
};

export const parseModxNewsletterFields = (
    modxFieldsString?: string
): NewsletterFormStructure | undefined => {
    try {
        if (!modxFieldsString) {
            throw new Error('Undefined newsletter fields settings input');
        }

        const settings: NewsletterFormStructure = JSON.parse(modxFieldsString);
        if (!settings || typeof settings !== 'object') {
            throw new Error(
                'Cannot parse newsletter fields settings from MODX'
            );
        }

        return settings;
    } catch (err) {
        return undefined;
    }
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
