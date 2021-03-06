import {
    NewsAuthorCardSliceType,
    NewsFooterSliceType,
    NumberListSliceType,
    ParallaxBackgroundSliceType,
    PriceListSliceType,
    PriceTableSliceType,
    QuoteSliceType,
    SimpleImageSliceType,
    SocialNavSliceType,
    TimelineSliceType,
} from 'index';

import { AccordionSliceType } from '../slices/Accordion';
import { ArticleSliceType } from '../slices/Article';
import { CallToActionSliceType } from '../slices/CallToAction';
import { ComparisonSliderSliceType } from '../slices/ComparisonSlider';
import { CrossPromotionListSliceType } from '../slices/CrossPromotionList';
import { FactGridSliceType } from '../slices/FactGrid';
import { FactListSliceType } from '../slices/FactList';
import { FeatureListSliceType } from '../slices/FeatureList';
import { FormSliceType } from '../slices/Form';
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

if (!process.env.NEXT_PUBLIC_API_ENDPOINT) {
    console.error(
        'Missing env: NEXT_PUBLIC_API_ENDPOINT is not defined. Error thrown in bkit-modx -> modx.ts'
    );
}
export const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
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
    primary?: Record<string, unknown>;
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
    | AccordionSliceType
    | ArticleSliceType
    | CallToActionSliceType
    | ComparisonSliderSliceType
    | CrossPromotionListSliceType
    | DynamicFormSliceType
    | FactGridSliceType
    | FactListSliceType
    | FeatureListSliceType
    | FormSliceType
    | GallerySliceType
    | HeaderSliceType
    | IconListSliceType
    | IntroSliceType
    | MapSliceType
    | NewsListSliceType
    | NewsOverviewSliceType
    | NumberListSliceType
    | ParallaxBackgroundSliceType
    | PosterSliceType
    | PriceListSliceType
    | PriceTableSliceType
    | QuickNavSliceType
    | QuickNavSliceType
    | SimpleImageSliceType
    | SocialNavSliceType
    | SocialWallSliceType
    | TableSliceType
    | TeaserSliceType
    | TimelineSliceType
    | VideoSliceType
    | QuoteSliceType;

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
    type: 'page' | 'settings' | 'news_page';
    alias: string;

    publishedOn?: string;
    updatedAt?: string;

    pagetitle?: string;
    ogImage?: ModxImageProps;
    seoDescription?: string;
    seoKeywords?: string;
    robots?: string;
    seoContentGroup?: string;
    seoRedirection?: string;

    nav_isinverted?: boolean;
    nav_withtopoffset?: boolean;
    nav_menuicon?: string;
    navbarAllowOverflow?: boolean;
    publication_date?: string;

    headScripts?: string;

    primary_link?: string;
    primary_label?: string;
    secondary_link?: string;
    secondary_label?: string;

    menuBreadcrumbs?: { link?: string; label: string }[];
    gTag?: string;

    settings?: ModxSettingsPage;
    strucOrganization: StructuredOrganizationData;
};

export interface ModxPage extends ModxDocument {
    header: HeaderSliceType;
    content: Array<PageContent>;
}

export interface SocialMediaItem {
    link?: string;
    icon?: Pick<ModxImageProps, 'small'>;
    'icon-inverted'?: Pick<ModxImageProps, 'small'>;
}

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
    address: {
        '@type': 'PostalAddress';
        streetAddress: string;
        addressLocality: string;
        postalCode: string;
        addressCountry: string;
    };
}

export interface ModxSettingsPage extends ModxPage {
    type: 'settings';
    menu: ModxMenuItemData;
    navTopBar: ModxNavBarData;
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
        address?: string;
        isInverted?: boolean;
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

export interface ModxNewsPage extends ModxDocument {
    newsCollectionUrl?: string;
    tags?: string;
    newsImage?: ModxImageProps;
    newsImagePreview?: ModxImageProps;

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

export type ModxNavBarData = {
    navbarInverted?: boolean;
    navbarOffset?: boolean;
    hideTopBarUnderMenu?: boolean;

    buttonStyle?: string;
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

export type ModxMenuItemData = {
    menuPrimary: Array<ModxNavItem>;
    footerMenuPrimary: Array<Omit<ModxNavItem, 'items'>>;
    menuSecondary: Array<{
        id: string;
        link: string;
        label: string;
        active?: boolean;
    }>;

    footerBottomLinks: Array<Omit<ModxNavItem, 'items'>>;

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

export const injectNewsData = async (
    slice: NewsOverviewSliceType | NewsListSliceType
) => {
    if (!slice.collectionId || slice.collectionId === -1) return slice;

    const sliceWithRice = await getPageData(`?id=${slice.collectionId}`);

    slice.items = sliceWithRice?.page?.newsArticles || [];

    return slice;
};

export const getNewsCollectors = (slice: PageContent) =>
    slice.slice_type === 'NewsOverview' || slice.slice_type === 'NewsList';

export const isModxPage = (pageToCheck: any): pageToCheck is ModxPage => {
    return pageToCheck?.type === 'page';
};

export const isNewsPage = (pageToCheck: any): pageToCheck is ModxNewsPage => {
    return pageToCheck?.type === 'news_page';
};
