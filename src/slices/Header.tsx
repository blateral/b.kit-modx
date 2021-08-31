import React from 'react';
React;
// import { Header } from '@blateral/b.kit';
// import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
// import { ModxImageProps, ModxSettingsData, ModxSlice, SizeSelect } from 'utils/modx';
// import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

// interface HeaderImageItem {
//     image?: ModxImageProps;
// }

// export interface HeaderSliceType extends ModxSlice<'Header', HeaderImageItem> {
//     primary: {
//         isActive?: boolean;
//         videoUrl?: string;
//         primary_label?: string;
//         primary_link?: string;
//         secondary_label?: string;
//         secondary_link?: string;
//         header_primary_label?: string;
//         header_primary_link?: string;
//         header_secondary_label?: string;
//         header_secondary_link?: string;
//         headerButtonstyle?: boolean;
//         badge?: ModxImageProps;
//         badgeOnMobile?: boolean;
//         title?: string;
//         titleAs?: HeadlineTag;
//         headerIntro?: string;
//         isNavLarge?: boolean;

//         size?: SizeSelect;
//         isInverted?: boolean;
//         navInverted?: boolean;
//     };

//     primaryAction?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     secondaryAction?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     primaryActionPointer?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     secondaryActionPointer?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     nav_primaryAction?: (props: {
//         isInverted?: boolean;
//         size?: 'desktop' | 'mobile';
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     nav_secondaryAction?: (props: {
//         isInverted?: boolean;
//         size?: 'desktop' | 'mobile';
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;

//     mapSocials?: (
//         socials?: Array<{ platform?: string; link?: string }>
//     ) => Array<{
//         href: string;
//         icon: JSX.Element;
//     }>;

//     // inject logo icon for into slice
//     injectLogo?: (props: {
//         isInverted?: boolean;
//         size?: 'full' | 'small';
//     }) => React.ReactNode;
//     customTopGradient?: string;
//     customBottomGradient?: string;
//     search?: (isInverted?: boolean) => React.ReactNode;

//     settingsPage?: ModxSettingsData;
//     pageUrl?: string;
// }

// // for this component defines image sizes
// const imageSizes = {
//     main: {
//         small: { width: 660, height: 792 },
//         medium: { width: 1100, height: 1320 },
//         semilarge: { width: 1100, height: 700 },
//         large: { width: 1596, height: 860 },
//         xlarge: { width: 2450, height: 1320 },
//     },
// } as ImageSizeSettings<{ main: ImageProps }>;

// export const HeaderSlice: React.FC<HeaderSliceType> = ({
//     primary: {
//         videoUrl: video_url,
//         badge,
//         badgeOnMobile: badge_on_mobile,
//         title,
//         headerIntro: header_intro,
//         size,
//         headerButtonstyle: header_buttonstyle,
//         primary_label,
//         primary_link,
//         secondary_label,
//         secondary_link,
//     },
//     items,
//     customBottomGradient,
//     customTopGradient,

//     primaryAction,
//     secondaryAction,
//     primaryActionPointer,
//     secondaryActionPointer,
// }) => {
//     // map header images
//     const headerImageMap = items.map(toComponentImageFormat);

//     return (
//         <Header
//             size={size || 'full'}
//             videoUrl={(video_url) || ''}
//             images={headerImageMap}
//             titleAs={getHeadlineTag(title)}
//             // title={getText(title)}
//             intro={{ title: getText(title), text: getText(header_intro) }}
//             badge={headerBadge(badge, badge_on_mobile)}
//             primaryCta={getPrimaryButtonOrPointer({
//                 isCta: !header_buttonstyle,
//                 primary_label,
//                 primary_link,
//                 primaryAction,
//                 primaryActionPointer,
//             })}
//             secondaryCta={getSecondaryButtonOrPointer({
//                 isCta: !header_buttonstyle,
//                 secondary_label,
//                 secondary_link,
//                 secondaryAction,
//                 secondaryActionPointer,
//             })}
//             customTopGradient={customTopGradient}
//             customBottomGradient={customBottomGradient}
//         />
//     );
// };

// function headerBadge(badge?: ModxImageProps, showOnMobile = true) {
//     return badge && badge.url
//         ? {
//               content: (
//                   <img
//                       src={badge?.url || ''}
//                       alt={badge?.alt || ''}
//                       style={{ height: '100%', width: '100%' }}
//                   />
//               ),
//               showOnMobile: showOnMobile,
//           }
//         : undefined;
// }

// const getPrimaryButtonOrPointer = ({
//     isCta,
//     primaryAction,
//     primaryActionPointer,
//     primary_label,
//     primary_link,
// }: {
//     isCta: boolean;
//     primaryAction?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     primaryActionPointer?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     primary_label?: string;
//     primary_link?: string;
// }) => {
//     if (isCta) {
//         return primaryAction && isValidAction(primary_label, primary_link)
//             ? (isInverted: boolean) =>
//                   primaryAction({
//                       isInverted,
//                       label: getText(primary_label),
//                       href: (primary_link) || '',
//                       isExternal: isstringExternal(primary_link),
//                   })
//             : undefined;
//     }

//     if (!isCta) {
//         return primaryActionPointer &&
//             isValidAction(primary_label, primary_link)
//             ? (isInverted: boolean) =>
//                   primaryActionPointer({
//                       isInverted,
//                       label: getText(primary_label),
//                       href: (primary_link) || '',
//                       isExternal: isstringExternal(primary_link),
//                   })
//             : undefined;
//     }

//     return undefined;
// };

// const getSecondaryButtonOrPointer = ({
//     isCta,
//     secondaryAction,
//     secondaryActionPointer,
//     secondary_label,
//     secondary_link,
// }: {
//     isCta: boolean;
//     secondaryAction?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     secondaryActionPointer?: (props: {
//         isInverted?: boolean;
//         label?: string;
//         href?: string;
//         isExternal?: boolean;
//     }) => React.ReactNode;
//     secondary_label?: string;
//     secondary_link?: string;
// }) => {
//     if (isCta) {
//         return secondaryAction && isValidAction(secondary_label, secondary_link)
//             ? (isInverted: boolean) =>
//                   secondaryAction({
//                       isInverted,
//                       label: getText(secondary_label),
//                       href: (secondary_link) || '',
//                       isExternal: isstringExternal(secondary_link),
//                   })
//             : undefined;
//     }

//     if (!isCta) {
//         return secondaryActionPointer &&
//             isValidAction(secondary_label, secondary_link)
//             ? (isInverted: boolean) =>
//                   secondaryActionPointer({
//                       isInverted,
//                       label: getText(secondary_label),
//                       href: (secondary_link) || '',
//                       isExternal: isstringExternal(secondary_link),
//                   })
//             : undefined;
//     }

//     return undefined;
// };

// const toComponentImageFormat = (item: HeaderImageItem)=>{

//     return {
//         ...item.image,
//         small: item.image?.small || "",
//           alt: (item?.image?.meta?.altText)

//   };}
