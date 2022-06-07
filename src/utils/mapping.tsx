/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { SocialItem } from '@blateral/b.kit/lib/components/blocks/SocialList';
import { SocialMediaItem } from './modx';

export const isSVG = (url?: string) => {
    return url ? /\.(svg)$/i.test(url) : false;
};

export const normalizeAnchorId = (anchorId?: string) => {
    return anchorId?.replace(/\s/g, '_').toLowerCase() || '';
};

export const parseLinkListFromHtml = (htmlString: string) => {
    const paragraphs = Array.from(htmlString.matchAll(/(<p>)(.*?)(<\/p>)/gis));

    if (paragraphs && paragraphs?.length < 1) return htmlString;

    const splittedParagraphs = paragraphs.map((item) => item[0]);

    const classifiedParagraphs = splittedParagraphs.map((paragraph) => {
        const trimmedParagraph = paragraph.trim().substring(3, 6);
        if (trimmedParagraph.includes('<a')) {
            const pair = Array.from(paragraph);
            pair.splice(2, 0, ' class="blat-link-list"');
            return pair.join('');
        } else {
            return paragraph;
        }
    });

    return classifiedParagraphs.join('');
};

export const mapSocials = (
    socials?: SocialMediaItem[],
    isInverted?: boolean
): SocialItem[] => {
    if (!socials) return [];

    const mappedSocials = socials
        .filter((social) => {
            return social.icon?.small && social.link;
        })
        .map<SocialItem>((social) => {
            const iconUrl = social.icon?.small || '';
            const invertedIconUrl =
                social['icon-inverted']?.small || iconUrl || '';

            return {
                href: social.link || '',
                icon: ({ title }) => (
                    <img
                        alt={title || ''}
                        title={title}
                        src={isInverted ? invertedIconUrl : iconUrl}
                    />
                ),
            };
        });

    return mappedSocials;
};
