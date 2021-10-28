import {
    ModxSettingsPage,
    SocialMediaItem,
    isExternalLink,
    endpoint,
} from 'utils/modx';

import { Footer, Theme } from '@blateral/b.kit';
import React from 'react';

export interface FooterSliceType {
    settings?: ModxSettingsPage;
    injectForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
        buttonLabel?: string;
    }) => React.ReactNode;
    mapSocials?: (
        socials: SocialMediaItem[],
        isInverted?: boolean
    ) => Array<{
        href: string;
        icon: JSX.Element;
    }>;
    theme?: Theme;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    settings,
    injectForm,
    mapSocials,
    theme,
}) => {
    const settingsData = settings;

    const mappedSocials =
        mapSocials &&
        settingsData &&
        settingsData.socials &&
        mapSocials(settingsData.socials, settingsData.footer?.isInverted);

    const logoLinkParsed = settingsData?.logo?.link;

    const logoLinkCleaned =
        logoLinkParsed && /index|start/.test(logoLinkParsed)
            ? logoLinkParsed.replace(/index|start/, '')
            : logoLinkParsed
            ? logoLinkParsed
            : '';

    return (
        <Footer
            theme={theme}
            isInverted={settingsData?.footer?.isInverted}
            socials={mappedSocials || undefined}
            logo={{
                img: settingsData?.logo?.footerLogo
                    ? `${endpoint}/${settingsData.logo.footerLogo}`
                    : '',
                link: logoLinkCleaned,
            }}
            contactData={settingsData?.footer?.address}
            newsTitle={settingsData?.newsletter?.title}
            newsText={settingsData?.newsletter?.text}
            newsForm={
                injectForm
                    ? (isInverted?: boolean) =>
                          injectForm({
                              isInverted,
                              buttonLabel: settingsData?.newsletter?.label,
                              placeholder:
                                  settingsData?.newsletter?.placeholder,
                          })
                    : undefined
            }
            siteLinks={settingsData?.menu?.footerMenuPrimary.map(
                (linkSlice) => {
                    return {
                        href: linkSlice.link || '',
                        label: linkSlice.label || '',
                        isExternal: isExternalLink(linkSlice.link),
                    };
                }
            )}
            bottomLinks={settingsData?.menu.footerBottomLinks?.map(
                (bottomLink) => {
                    const result = {
                        href: bottomLink.link || '',
                        label: bottomLink.label || '',
                        isExternal: isExternalLink(bottomLink.link),
                    };
                    return result;
                }
            )}
        />
    );
};
