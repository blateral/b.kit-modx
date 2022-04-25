import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { assignTo, CallToAction, ThemeMods } from '@blateral/b.kit';
import {
    ModxSlice,
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageMetaData,
} from 'utils/modx';

interface ContactData {
    avatar?: {
        src?: string;
        meta?: ModxImageMetaData;
    };
    description?: string;
}

interface BadgeData {
    src?: string;
    meta?: ModxImageMetaData;
}

export interface CallToActionSliceType extends ModxSlice<'CallToAction'> {
    isActive?: boolean;
    theme?: ThemeMods;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: BgMode;
    bgColor?: string;
    isMirrored?: boolean;
    newsForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
        buttonIcon?: React.ReactNode;
        backgroundStyle?: 'white' | 'gray';
    }) => React.ReactNode;

    superTitle?: string;
    superTitleAs?: string;

    title?: string;
    titleAs?: string;

    text?: string;

    contact?: ContactData;
    badge?: BadgeData;
    primary_label?: string;
    primary_link?: string;
    secondary_link?: string;
    secondary_label?: string;

    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const CallToActionSlice: React.FC<CallToActionSliceType> = ({
    theme,
    anchor,
    bgMode,
    bgColor,
    title,
    titleAs,
    superTitle,
    superTitleAs,
    badge,
    text,
    contact,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,
    newsForm,
    primaryAction,
    secondaryAction,
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
        <CallToAction
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            // newsFormMain={
            //     newsForm
            //         ? (isInverted) =>
            //               newsForm({
            //                   isInverted,
            //                   placeholder: mainColumn?.newsPlaceholder,
            //               })
            //         : undefined
            // }

            superTitleAs={(superTitleAs as HeadlineTag) || 'div'}
            titleAs={(titleAs as HeadlineTag) || 'div'}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            title={title}
            superTitle={superTitle}
            text={text}
            contact={
                contact?.avatar?.src
                    ? {
                          avatar: contact?.avatar?.src
                              ? {
                                    src: contact?.avatar?.src || '',
                                    alt: contact?.avatar?.meta?.altText || '',
                                }
                              : undefined,

                          description: contact?.description || '',
                      }
                    : undefined
            }
            badge={
                badge?.src ? (
                    <img src={badge.src} alt={badge.meta?.altText || ''} />
                ) : null
            }
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted: boolean) =>
                          primaryAction({
                              isInverted,
                              label: primary_label,
                              href: primary_link || '',
                              isExternal: isExternalLink(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted: boolean) =>
                          secondaryAction({
                              isInverted,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
        />
    );
};
