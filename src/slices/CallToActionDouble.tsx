import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { CallToActionDouble } from '@blateral/b.kit';
import {
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageMetaData,
    ModxSlice,
} from 'utils/modx';

interface ContactData {
    avatar?: {
        src?: string;
        meta?: ModxImageMetaData;
    };
    description?: string;
}

export interface CallToActionDoubleSliceType
    extends ModxSlice<'CallToActionDouble'> {
    isActive?: boolean;
    bgMode?: BgMode;

    superTitle?: string;
    superTitleAs?: HeadlineTag;

    title?: string;
    titleAs?: HeadlineTag;

    text?: string;
    contact?: ContactData;
    primary_label?: string;
    primary_link?: string;
    secondary_link?: string;
    secondary_label?: string;

    column?: {
        superTitle?: string;
        title?: string;
        text?: string;
        contact?: ContactData;
        primary_label?: string;
        primary_link?: string;
        secondary_link?: string;
        secondary_label?: string;
    };

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

export const CallToActionDoubleSlice: React.FC<CallToActionDoubleSliceType> = ({
    bgMode,
    title,
    titleAs,
    superTitle,
    superTitleAs,

    text,
    contact,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,
    column,
    primaryAction,
    secondaryAction,
}) => {
    return (
        <CallToActionDouble
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            title={title}
            titleAs={titleAs}
            superTitle={superTitle}
            superTitleAs={superTitleAs}
            text={text}
            contact={{
                avatar: contact?.avatar?.src
                    ? {
                          src: contact?.avatar?.src || '',
                          alt: contact?.avatar?.meta?.altText || '',
                      }
                    : undefined,

                description: contact?.description || '',
            }}
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
            column={
                column?.title || column?.superTitle || column?.text
                    ? {
                          title: column?.title,
                          superTitle: column?.superTitle,
                          text: column?.text,
                          contact: {
                              avatar: column?.contact?.avatar?.src
                                  ? {
                                        src: column?.contact?.avatar?.src || '',
                                        alt:
                                            column?.contact?.avatar?.meta
                                                ?.altText || '',
                                    }
                                  : undefined,

                              description: column?.contact?.description || '',
                          },
                          primaryAction:
                              primaryAction &&
                              isValidAction(
                                  column?.primary_label,
                                  column?.primary_link
                              )
                                  ? (isInverted: boolean) =>
                                        primaryAction({
                                            isInverted,
                                            label: column?.primary_label,
                                            href: column?.primary_link || '',
                                            isExternal: isExternalLink(
                                                column?.primary_link
                                            ),
                                        })
                                  : undefined,

                          secondaryAction:
                              secondaryAction &&
                              isValidAction(
                                  column?.secondary_label,
                                  column?.secondary_link
                              )
                                  ? (isInverted: boolean) =>
                                        secondaryAction({
                                            isInverted,
                                            label: column?.secondary_label,
                                            href: column?.secondary_link || '',
                                            isExternal: isExternalLink(
                                                column?.secondary_link
                                            ),
                                        })
                                  : undefined,
                      }
                    : undefined
            }
        />
    );
};
