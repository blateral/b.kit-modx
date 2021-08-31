import {
    CookieActions,
    CookieConsent,
    CookieIcon,
    CookieText,
    CookieTitle,
} from '@blateral/b.kit';
import React from 'react';
import { ModxImageProps } from 'utils/modx';

export interface CookieConsentSliceType {
    icon?: ModxImageProps;
    title?: string;
    text?: string;
    acceptCtaLabel?: string;
    declineCtaLabel?: string;

    // helpers to define component elements outside of slice
    cookieName?: string;
    urlWhitelist?: string[];
    consentAcceptStatusMsg?: string;
    consentDeclineStatusMsg?: string;
    noCookieStatusMsg?: string;
    dateFormat?: string;
    timeFormat?: string;
    lifetime?: number;
    localeKey?: 'de' | 'eng';
    zIndex?: number;
    overlayOpacity?: number;
    acceptAction?: (props: {
        handleAccept: () => void;
        additionalAcceptProps: {
            ['data-gtm']: string;
        };
        label?: string;
    }) => React.ReactNode;
    declineAction?: (props: {
        handleDecline: () => void;
        label?: string;
        additionalDeclineProps: {
            ['data-gtm']: string;
        };
    }) => React.ReactNode;
}

export const CookieConsentSlice: React.FC<CookieConsentSliceType> = ({
    icon,
    title,
    text,
    acceptCtaLabel,
    declineCtaLabel,
    acceptAction,
    declineAction,
    ...rest
}) => {
    // FIXME: Locale key 'eng' not compatible with 'en'
    return (
        <CookieConsent {...{ ...rest, localeKey: 'de' }}>
            {({
                handleAccept,
                handleDecline,
                additionalAcceptProps,
                additionalDeclineProps,
            }) => (
                <>
                    {icon?.small && (
                        <CookieIcon
                            src={icon?.small}
                            alt={icon?.meta?.altText || ''}
                        />
                    )}
                    {title && <CookieTitle innerHTML={title} />}
                    {text && <CookieText innerHTML={text} />}
                    {(acceptAction || declineAction) && (
                        <CookieActions
                            primary={
                                acceptAction &&
                                acceptCtaLabel &&
                                acceptAction({
                                    handleAccept,
                                    additionalAcceptProps,
                                    label: acceptCtaLabel,
                                })
                            }
                            secondary={
                                declineAction &&
                                declineCtaLabel &&
                                declineAction({
                                    handleDecline,
                                    additionalDeclineProps,
                                    label: declineCtaLabel,
                                })
                            }
                        />
                    )}
                </>
            )}
        </CookieConsent>
    );
};
