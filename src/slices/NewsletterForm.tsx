import { ModxSlice, parseModxNewsletterFields } from 'utils/modx';

import { assignTo, NewsletterForm, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { normalizeAnchorId } from 'utils/mapping';
import {
    FieldGenerationProps,
    NewsletterFormStructure,
    FormData,
} from '@blateral/b.kit/lib/components/sections/NewsletterForm';

type BgMode = 'full' | 'inverted';

export interface NewsletterFormSliceType extends ModxSlice<'NewsletterForm'> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;

    modxFields?: string;
    fields?: NewsletterFormStructure | undefined;
    action?: string;
    method?: string;

    /** Function to inject custom field definition */
    customField?: (props: FieldGenerationProps) => React.ReactNode;

    /** Form submission callback */
    onSubmit?: (values: FormData, element: HTMLFormElement) => Promise<void>;

    /** Function to inject custom submit button */
    submitAction?: (props: {
        isInverted?: boolean;
        handleSubmit?: () => Promise<any>;
        isDisabled?: boolean;
    }) => React.ReactNode;

    theme?: ThemeMods;
}

export const NewsletterFormSlice: React.FC<NewsletterFormSliceType> = ({
    bgMode,
    anchorId,
    bgColor,
    modxFields,
    fields,
    action,
    method = 'post',
    customField,
    onSubmit,
    submitAction,
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

    const modxFieldsSettings = parseModxNewsletterFields(modxFields);

    // default field settings
    const defaultFields: NewsletterFormStructure = {
        VORNAME: {
            inputType: 'text',
            label: 'Vorname',
            placeholder: 'Vorname..',
            isRequired: true,
            errorMsg: 'Bitte geben Sie Ihren Vornamen an!',
        },
        NACHNAME: {
            inputType: 'text',
            label: 'Nachname',
            placeholder: 'Nachname..',
            isRequired: true,
            errorMsg: 'Bitte geben Sie Ihren Nachnamen an!',
        },
        EMAIL: {
            inputType: 'email',
            label: 'E-Mail',
            placeholder: 'E-Mail Adresse..',
            isRequired: true,
            errorMsg: 'Bitte geben Sie Ihre E-Mail Adresse an!',
        },
    };

    return (
        <NewsletterForm
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            fields={fields || modxFieldsSettings || defaultFields}
            action={action}
            method={method}
            customField={customField}
            onSubmit={onSubmit}
            submitAction={submitAction}
        />
    );
};
