import { ModxSettings } from 'utils/modx';

import { assignTo, Footer, ThemeMods } from '@blateral/b.kit';
import React from 'react';

import { FooterState } from '@blateral/b.kit/lib/components/sections/footer/Footer';
import { Language } from '@blateral/b.kit/lib/components/blocks/LanguageSwitcher';

export interface FooterSliceType {
    settings?: ModxSettings;
    languages?: Array<Language>;
    customColumn?: ((props: FooterState) => React.ReactNode) | undefined;

    theme?: ThemeMods;
    bgColor?: string;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    settings,
    customColumn,
    theme,
    bgColor,
    languages,
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
        <Footer
            theme={sliceTheme}
            siteLinks={settings?.menu?.footerMenus.filter(
                (menu) => menu?.links && menu.links.length > 0
            )}
            customColumn={customColumn}
            footNote={settings?.footer?.note || ''}
            bottomLinks={settings?.menu.footerBottomLinks}
            languages={languages?.filter(
                (language) => language?.label && language?.link?.href
            )}
        />
    );
};
