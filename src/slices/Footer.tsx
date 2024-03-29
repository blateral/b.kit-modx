import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { FooterState } from '@blateral/b.kit/types/components/sections/footer/Footer';
import { Language } from '@blateral/b.kit/types/components/blocks/LanguageSwitcher';

import { ModxSettings } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const Footer = React.lazy(() => import('imports/_Footer'));

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
            languages={languages?.filter((language) => language?.label)}
        />
    );
};
