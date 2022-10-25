import {
    CookieActions,
    CookieConsent,
    CookieIcon,
    CookieText,
    CookieTitle,
    CookieTypeSelect,
} from '@blateral/b.kit';
import { CookieTypes } from '@blateral/b.kit/lib/utils/cookie-consent/useCookieConsent';
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
    initialCookieTypes?: CookieTypes;
    urlWhitelist?: string[];
    consentStatusMsg?: string;
    dateFormat?: string;
    timeFormat?: string;
    lifetime?: number;
    localeKey?: 'de' | 'en';
    zIndex?: number;
    overlayOpacity?: number;
    status?: (props: {
        updatedAt: number;
        state: CookieTypes;
    }) => React.ReactElement;
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
    status,
    acceptAction,
    declineAction,
    consentStatusMsg = 'Cookie aktualisiert am <DATE> um <TIME> Uhr',
    dateFormat = 'dd.mm.yy',
    timeFormat = 'hh:mm',
    localeKey = 'de',
    initialCookieTypes = {
        essentials: {
            isAccepted: true,
            isEditable: false,
            label: 'Essentielle Funktionen',
        },
        analytics: {
            isAccepted: false,
            isEditable: true,
            label: 'Analyse & Marketing',
        },
    },
    ...rest
}) => {
    return (
        <CookieConsent
            localeKey={localeKey}
            consentStatusMsg={consentStatusMsg}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            initialCookieTypes={initialCookieTypes}
            status={status}
            {...rest}
        >
            {({
                acceptAll,
                declineAll,
                additionalAcceptProps,
                additionalDeclineProps,
            }) => (
                <React.Fragment>
                    {icon?.small && (
                        <CookieIcon
                            src={icon?.small}
                            alt={icon?.meta?.altText || ''}
                        />
                    )}
                    {title && <CookieTitle isCentered innerHTML={title} />}
                    {text && <CookieText isCentered innerHTML={text} />}
                    {(acceptAction || declineAction) && (
                        <CookieActions
                            isMirrored
                            primary={
                                acceptAction &&
                                acceptCtaLabel &&
                                acceptAction({
                                    handleAccept: acceptAll,
                                    additionalAcceptProps,
                                    label: acceptCtaLabel,
                                })
                            }
                            secondary={
                                declineAction &&
                                declineCtaLabel &&
                                declineAction({
                                    handleDecline: declineAll,
                                    additionalDeclineProps,
                                    label: declineCtaLabel,
                                })
                            }
                        />
                    )}
                </React.Fragment>
            )}
        </CookieConsent>
    );
};

export interface CookieConsentAdvancedSliceType extends CookieConsentSliceType {
    footNote?: string;
}

export const CookieConsentAdvancedSlice: React.FC<
    CookieConsentAdvancedSliceType
> = ({
    icon,
    title,
    text,
    acceptCtaLabel,
    declineCtaLabel,
    footNote,
    status,
    acceptAction,
    declineAction,
    consentStatusMsg = 'Cookie aktualisiert am <DATE> um <TIME> Uhr',
    dateFormat = 'dd.mm.yy',
    timeFormat = 'hh:mm',
    localeKey = 'de',
    initialCookieTypes = {
        essentials: {
            isAccepted: true,
            isEditable: false,
            label: 'Essentielle Funktionen',
        },
        analytics: {
            isAccepted: false,
            isEditable: true,
            label: 'Analyse & Marketing',
        },
        functionals: {
            isAccepted: false,
            isEditable: true,
            label: 'Funktionelle Erweiterungen',
        },
    },
    ...rest
}) => {
    return (
        <CookieConsent
            localeKey={localeKey}
            consentStatusMsg={consentStatusMsg}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            initialCookieTypes={initialCookieTypes}
            status={status}
            {...rest}
        >
            {({
                acceptAll,
                acceptSelected,
                setConsent,
                types,
                additionalAcceptProps,
                additionalDeclineProps,
            }) => (
                <React.Fragment>
                    {icon?.small && (
                        <CookieIcon
                            src={icon?.small}
                            alt={icon?.meta?.altText || ''}
                        />
                    )}
                    {title && <CookieTitle innerHTML={title} />}
                    {text && <CookieText innerHTML={text} />}
                    {types && (
                        <CookieTypeSelect
                            types={types}
                            setConsent={setConsent}
                        />
                    )}
                    {footNote && <CookieText innerHTML={footNote} />}
                    {(acceptAction || declineAction) && (
                        <CookieActions
                            isMirrored
                            primary={
                                acceptAction &&
                                acceptCtaLabel &&
                                acceptAction({
                                    handleAccept: acceptAll,
                                    additionalAcceptProps,
                                    label: acceptCtaLabel,
                                })
                            }
                            secondary={
                                declineAction &&
                                declineCtaLabel &&
                                declineAction({
                                    handleDecline: acceptSelected,
                                    additionalDeclineProps,
                                    label: declineCtaLabel,
                                })
                            }
                        />
                    )}
                </React.Fragment>
            )}
        </CookieConsent>
    );
};
