import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { CallToAction } from '@blateral/b.kit';
import {
    ModxSlice,
    BgMode,
    ModxImageProps,
    isExternalLink,
    isValidAction,
} from 'index';

export interface CallToActionSliceType extends ModxSlice<'CallToAction'> {
    isActive?: boolean;
    bgMode?: BgMode;
    isMirrored?: boolean;
    mainColumn?: {
        superTitle?: string;
        title?: string;
        superTitleAs?: string;
        titleAs?: string;
        text?: string;
        contact?: {
            avatar?: Pick<ModxImageProps, 'small' | 'meta'>;
            description?: string;
        };
        badge?: Pick<ModxImageProps, 'small' | 'meta'>;

        primary_link?: string;
        primary_label?: string;
        secondary_link?: string;
        secondary_label?: string;
    };
    secondaryColumn?: {
        superTitle?: string;
        title?: string;
        superTitleAs?: string;
        titleAs?: string;
        text?: string;
        primary_link?: string;
        primary_label?: string;
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

export const CallToActionSlice: React.FC<CallToActionSliceType> = ({
    bgMode,
    mainColumn,
    secondaryColumn,
    primaryAction,
    secondaryAction,
}) => {
    console.log(mainColumn?.contact?.description);
    return (
        <CallToAction
            superTitleAs={(mainColumn?.superTitleAs as HeadlineTag) || 'div'}
            titleAs={(mainColumn?.titleAs as HeadlineTag) || 'div'}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            title={mainColumn?.title}
            superTitle={mainColumn?.superTitle}
            text={mainColumn?.text}
            contact={{
                avatar: {
                    src: mainColumn?.contact?.avatar?.small || '',
                    alt: mainColumn?.contact?.avatar?.meta?.altText || '',
                },

                description: mainColumn?.contact?.description || '',
            }}
            badge={
                mainColumn?.badge ? <img src={mainColumn.badge.small} /> : null
            }
            primaryAction={
                primaryAction &&
                isValidAction(
                    mainColumn?.primary_label,
                    mainColumn?.primary_link
                )
                    ? (isInverted: boolean) =>
                          primaryAction({
                              isInverted,
                              label: mainColumn?.primary_label,
                              href: mainColumn?.primary_link || '',
                              isExternal: isExternalLink(
                                  mainColumn?.primary_link
                              ),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(
                    mainColumn?.primary_label,
                    mainColumn?.primary_link
                )
                    ? (isInverted: boolean) =>
                          secondaryAction({
                              isInverted,
                              label: mainColumn?.secondary_label,
                              href: mainColumn?.secondary_link || '',
                              isExternal: isExternalLink(
                                  mainColumn?.secondary_link
                              ),
                          })
                    : undefined
            }
            column={
                secondaryColumn?.title ||
                secondaryColumn?.superTitle ||
                secondaryColumn?.text
                    ? {
                          title: secondaryColumn?.title,
                          superTitle: secondaryColumn?.superTitle,
                          text: secondaryColumn?.text,
                          primaryAction:
                              primaryAction &&
                              isValidAction(
                                  secondaryColumn?.primary_label,
                                  secondaryColumn?.primary_link
                              )
                                  ? (isInverted: boolean) =>
                                        primaryAction({
                                            isInverted,
                                            label: secondaryColumn?.primary_label,
                                            href:
                                                secondaryColumn?.primary_link ||
                                                '',
                                            isExternal: isExternalLink(
                                                secondaryColumn?.primary_link
                                            ),
                                        })
                                  : undefined,

                          secondaryAction:
                              secondaryAction &&
                              isValidAction(
                                  secondaryColumn?.secondary_label,
                                  secondaryColumn?.secondary_link
                              )
                                  ? (isInverted: boolean) =>
                                        secondaryAction({
                                            isInverted,
                                            label: secondaryColumn?.secondary_label,
                                            href:
                                                secondaryColumn?.secondary_link ||
                                                '',
                                            isExternal: isExternalLink(
                                                secondaryColumn?.secondary_link
                                            ),
                                        })
                                  : undefined,
                      }
                    : undefined
            }
        />
    );
};
