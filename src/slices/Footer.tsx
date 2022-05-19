import { ModxSettings } from 'utils/modx';

import { assignTo, Footer, ThemeMods } from '@blateral/b.kit';
import React from 'react';

import { FooterState } from '@blateral/b.kit/lib/components/sections/footer/Footer';
import { Language } from '@blateral/b.kit/lib/components/blocks/LanguageSwitcher';
import { normalizeAnchorId } from 'utils/mapping';

export interface FooterSliceType {
    settings?: ModxSettings;
    languages?: Array<Language>;
    customColumn?: ((props: FooterState) => React.ReactNode) | undefined;
    bottomBar?: (props: FooterState) => React.ReactNode;
    theme?: ThemeMods;
    bgColor?: string;
    anchorId?: string;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    settings,
    customColumn,
    theme,
    bgColor,
    languages,
    bottomBar,
    anchorId,
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
            bgMode={settings?.footer?.bgMode}
            anchorId={normalizeAnchorId(anchorId)}
            theme={sliceTheme}
            siteLinks={settings?.menu?.footerMenus.filter(
                (menu) => menu?.links && menu.links.length > 0
            )}
            bottomBar={bottomBar}
            customColumn={customColumn}
            footNote={settings?.footer?.note || ''}
            bottomLinksLeft={settings?.menu.bottomLinksLeft}
            bottomLinksRight={settings?.menu.bottomLinksRight}
            languages={languages?.filter(
                (language) => language?.label && language?.link?.href
            )}
        />
    );
};
