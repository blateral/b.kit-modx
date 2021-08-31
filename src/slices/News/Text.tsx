import { NewsText } from '@blateral/b.kit';
import React from 'react';
import { isExternalLink, isValidAction, ModxSlice } from 'utils/modx';

export interface NewsTextSliceType extends ModxSlice<'NewsText'> {
    primary: {
        isActive?: boolean;
        text?: string;
        primary_link?: string;
        secondary_link?: string;
        primary_label?: string;
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

export const NewsTextSlice: React.FC<NewsTextSliceType> = ({
    primary: {
        text,
        primary_link,
        primary_label,
        secondary_link,
        secondary_label,
    },
    primaryAction,
    secondaryAction,
}) => {
    return (
        <NewsText
            text={text || ''}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: primary_label,
                              href: primary_link || '',
                              isExternal: isExternalLink(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
        />
    );
};
