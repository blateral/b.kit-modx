import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { NewsVideo } from '@blateral/b.kit/sections';
import { mapImageToComponentData, ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsVideoSliceType extends ModxSlice<'NewsVideo'> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    embedId?: string;
    image?: ModxImageProps;

    consentText?: string;
    consentActionLabel?: string;
    consentAction?: (props: {
        label: string;
        handleClick?: () => void;
        consentProps: Record<string, string>;
    }) => React.ReactNode;

    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsVideoSlice: React.FC<NewsVideoSliceType> = ({
    bgMode,
    embedId,
    image,
    consentText,
    consentActionLabel,
    consentAction,
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
        <NewsVideo
            theme={sliceTheme}
            embedId={embedId || ''}
            bgMode={bgMode}
            bgImage={mapImageToComponentData(image)}
            consentText={consentText}
            consentAction={
                consentAction && consentActionLabel
                    ? ({ consentProps, handleClick }) =>
                          consentAction({
                              consentProps,
                              handleClick,
                              label: consentActionLabel,
                          })
                    : undefined
            }
        />
    );
};
