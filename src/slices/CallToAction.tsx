import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/types/components/typography/Heading';

import {
    ModxSlice,
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageMetaData,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const CallToAction = React.lazy(() => import('imports/_CallToAction'));

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

export interface CtaSliceActionProps {
    isInverted?: boolean;
    label?: string;
    href?: string;
    isExternal?: boolean;
    isTextCentered?: boolean;
}

export interface CallToActionSliceType extends ModxSlice<'CallToAction'> {
    isActive?: boolean;
    theme?: ThemeMods;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;
    isMirrored?: boolean;

    superTitle?: string;
    superTitleAs?: string;

    title?: string;
    titleAs?: HeadlineTag;

    text?: string;

    contact?: ContactData;
    badge?: BadgeData;
    primary_label?: string;
    primary_link?: string;
    secondary_link?: string;
    secondary_label?: string;

    primaryAction?: (props: CtaSliceActionProps) => React.ReactNode;
    secondaryAction?: (props: CtaSliceActionProps) => React.ReactNode;
}

export const CallToActionSlice: React.FC<CallToActionSliceType> = ({
    theme,
    anchorId,
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
            anchorId={normalizeAnchorId(anchorId)}
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
                    ? (props) =>
                          primaryAction({
                              isInverted: props?.isInverted,
                              isTextCentered: props?.isTextCentered,
                              label: primary_label,
                              href: primary_link || '',
                              isExternal: isExternalLink(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? ({ isInverted, isTextCentered }) =>
                          secondaryAction({
                              isInverted,
                              isTextCentered,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
        />
    );
};

export const getCallToActionSearchData = (
    slice: CallToActionSliceType
): string[] => {
    const data: string[] = [];
    if (slice?.title) data.push(slice.title);
    if (slice?.text) data.push(slice.text);
    if (slice?.contact?.description) data.push(slice.contact.description);
    return data;
};
