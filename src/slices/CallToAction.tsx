import React from 'react';
import { assignTo, CallToAction, Theme } from '@blateral/b.kit';
import {
    BgMode,
    isExternalLink,
    isHeadlineTag,
    isValidAction,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

interface AddressSliceType {
    icon?: Pick<ModxImageProps, 'small' | 'meta'>;
    label?: string;
}

export interface CallToActionSliceType
    extends ModxSlice<
        'CallToAction' | 'CallToActionNewsletter',
        AddressSliceType
    > {
    isActive?: boolean;
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;

    text?: string;
    bgMode?: BgMode;
    bgColor?: string;

    contactAvatar?: Pick<ModxImageProps, 'small' | 'meta'>;
    contact: { name?: string; description?: string };

    // FIXME: NEwsletter
    newsletter_placeholder?: string;
    newsletter_button_label?: string;

    primary_link?: string;
    secondary_link?: string;
    primary_label?: string;
    secondary_label?: string;

    badge?: Pick<ModxImageProps, 'small' | 'meta'>;
    // helpers to define component elements outside of slice
    injectForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
        buttonLabel?: string;
    }) => React.ReactNode;
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
    theme?: Theme;
}

export const CallToActionSlice: React.FC<CallToActionSliceType> = ({
    superTitle,
    superTitleAs,
    title,
    titleAs,
    text,
    bgMode,
    bgColor,

    contactAvatar,
    contact,

    newsletter_placeholder,
    newsletter_button_label,

    primary_link,
    primary_label,
    secondary_link,
    secondary_label,
    badge,
    items,
    injectForm,
    primaryAction,
    secondaryAction,
    theme,
}) => {
    // merging cms and component theme settings
    const sliceTheme = assignTo(
        {
            colors: {
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <CallToAction
            theme={sliceTheme}
            bgMode={bgMode === 'inverted' ? 'inverted' : 'full'}
            title={title}
            titleAs={isHeadlineTag(titleAs) ? titleAs : 'div'}
            superTitle={superTitle}
            superTitleAs={isHeadlineTag(superTitleAs) ? superTitleAs : 'div'}
            text={text}
            contact={
                contact && contact.name && contactAvatar?.small
                    ? {
                          avatar: contactAvatar.small
                              ? {
                                    src: contactAvatar?.small || '',
                                    alt: contactAvatar?.meta?.altText || '',
                                }
                              : undefined,
                          name: contact.name,
                          description: contact.description,
                          addresses:
                              items &&
                              items?.map((item) => {
                                  return {
                                      decorator: item?.icon?.small && (
                                          <img
                                              src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${item?.icon?.small}`}
                                              alt={item?.icon.meta?.altText}
                                          />
                                      ),
                                      label: item?.label || '',
                                  };
                              }),
                      }
                    : undefined
            }
            newsForm={
                newsletter_placeholder || newsletter_button_label
                    ? (isInverted?: boolean) =>
                          injectForm &&
                          injectForm({
                              isInverted,
                              buttonLabel: newsletter_button_label,
                              placeholder: newsletter_placeholder,
                          })
                    : undefined
            }
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
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
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
            badge={
                badge &&
                badge.small && (
                    <img
                        src={`${badge.small}`}
                        alt={badge.meta?.altText || ''}
                        style={{ height: '100%', width: '100%' }}
                    />
                )
            }
        />
    );
};
