import React from 'react';

import { Footer } from '@blateral/b.kit';
import { ModxSettingsPage } from 'utils/modx';

export interface FooterSliceType {
    settingsPage?: ModxSettingsPage;
    injectForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
        buttonLabel?: string;
    }) => React.ReactNode;
    mapSocials?: (socials: {
        headLabel?: string;
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
    }) => Array<{
        href: string;
        icon: JSX.Element;
    }>;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    settingsPage,
    injectForm,
    mapSocials,
}) => {
    const settingsData = settingsPage;
    const mappedSocials =
        mapSocials &&
        settingsData &&
        settingsData.socials &&
        mapSocials(settingsData.socials);

    const logoLinkParsed = settingsData?.logo?.link;

    const logoLinkCleaned =
        logoLinkParsed && /index/.test(logoLinkParsed)
            ? logoLinkParsed.replace('index', '')
            : logoLinkParsed
            ? logoLinkParsed
            : '';

    // FIXME: Updating footer data to use modx structures
    return (
        <Footer
            isInverted={settingsData?.footer?.isInverted}
            socials={mappedSocials || undefined}
            logo={{
                img: settingsData?.footer?.logo?.small || '',
                link: logoLinkCleaned,
            }}
            contactData={settingsData?.address}
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
            // siteLinks={settingsData?.body?.map((linkSlice) => {
            //     return {
            //         href:
            //             (linkSlice.primary.footer_nav_link) ||
            //             '',
            //         label: (linkSlice.primary.footer_nav_title as any) || '',
            //         isExternal: isstringExternal(
            //             linkSlice?.primary?.footer_nav_link
            //         ),
            //     };
            // })}
            // bottomLinks={settingsData?.footer_bottomlinks?.map((bottomLink) => {
            //     const result = {
            //         href: (bottomLink.href) || '',
            //         label: bottomLink.label || '',
            //         isExternal: isstringExternal(bottomLink.href),
            //     };
            //     return result;
            // })}
        />
    );
};
