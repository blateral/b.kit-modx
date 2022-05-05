import { Accordion, assignTo, ThemeMods } from '@blateral/b.kit';
import { LinkListProps } from '@blateral/b.kit/lib/components/blocks/LinkList';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';
import React from 'react';
import { BgMode, ModxSlice } from 'utils/modx';
import { normalizeAnchorId, parseLinkListFromHtml } from 'utils/mapping';

interface AccordionItem {
    label: string;
    text?: string;
    aside?: string;
    linkList?: LinkListProps;
    linkListAside?: LinkListProps;
}

export interface AccordionSliceType
    extends ModxSlice<'Accordion', AccordionItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;
    theme?: ThemeMods;
}

export const AccordionSlice: React.FC<AccordionSliceType> = ({
    bgMode,
    anchorId,
    items,
    bgColor,
    theme,
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
        <Accordion
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            items={items.map((item) => {
                const filteredLinkList = {
                    items: item.linkList?.items?.filter(filterWithLabelAndHref),
                };

                const filteredAsideLinkList = {
                    items: item.linkListAside?.items?.filter(
                        filterWithLabelAndHref
                    ),
                };

                return {
                    label: item.label,
                    text: item.text
                        ? parseLinkListFromHtml(item.text)
                        : item.text,
                    aside: item.aside,
                    linkList: filteredLinkList,
                    linkListAside: filteredAsideLinkList,
                };
            })}
            bgMode={
                bgMode === 'inverted' || bgMode === 'full'
                    ? (bgMode as 'full' | 'inverted')
                    : undefined
            }
        />
    );
};

const filterWithLabelAndHref = (item: {
    label?: string | undefined;
    link?: LinkProps | undefined;
}) => {
    return item.label && item.link?.href;
};
