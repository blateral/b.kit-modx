import { assignTo, DynamicForm, Theme } from '@blateral/b.kit';
import { FieldGenerationProps } from '@blateral/b.kit/lib/components/sections/DynamicForm';
import React from 'react';

import { BgMode, ModxSlice } from '../utils/modx';

export interface FormStructure {
    [key: string]:
        | Field
        | Area
        | Select
        | Datepicker
        | FieldGroup
        | FileUploadField;
}

export interface FormField {
    isRequired?: boolean;
}

export interface Field extends FormField {
    type: 'Field';
    inputType?: 'text' | 'number' | 'email' | 'password' | 'tel';
    initalValue?: string;
    placeholder?: string;
    info?: string;
    icon?: { src: string; alt?: string };
}

export interface Area extends FormField {
    type: 'Area';
    initalValue?: string;
    placeholder?: string;
    info?: string;
}

export interface Select extends FormField {
    type: 'Select';
    initalValue?: string;
    placeholder?: string;
    dropdownItems: {
        value?: string;
        label?: string;
    }[];
    info?: string;
    icon?: { src: string; alt?: string };
}

export interface Datepicker extends FormField {
    type: 'Datepicker';
    initialDates?: [Date, Date];
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    singleSelect?: boolean;
    info?: string;
    icon?: { src: string; alt?: string };
}

export interface FieldGroup extends FormField {
    type: 'FieldGroup';
    groupType: 'Radio' | 'Checkbox';
    fields: Array<{ initialChecked?: boolean; text?: string }>;
}

export interface FileUploadField extends FormField {
    type: 'Upload';
    label?: string;
    infoMessage?: string;
    errorMessage?: string;
    isDisabled?: boolean;
}

export interface FormData {
    [key: string]:
        | string
        | boolean
        | Array<string>
        | [Date | null, Date | null];
}

export interface ArticleSliceType extends ModxSlice<'DynamicForm', FormField> {
    isActive?: boolean;
    theme?: Theme;
    bgColor?: BgMode;
    onSubmit?: (values: FormData) => Promise<void>;
    submitAction?: (props: {
        isInverted?: boolean | undefined;
        handleSubmit?: (() => Promise<any>) | undefined;
        isDisabled?: boolean | undefined;
    }) => React.ReactNode;
    bgMode?: 'full' | 'inverted' | undefined;
    definitions?: {
        field?: (props: FieldGenerationProps<Field>) => React.ReactNode;
        area?: (props: FieldGenerationProps<Area>) => React.ReactNode;
        select?: (props: FieldGenerationProps<Select>) => React.ReactNode;
        datepicker?: (
            props: FieldGenerationProps<Datepicker>
        ) => React.ReactNode;
        checkbox?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
        radio?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
        upload?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
    };
}

export const ArticleSlice: React.FC<ArticleSliceType> = ({
    theme,
    bgColor,
}) => {
    // merging cms and component theme settings
    const sliceTheme = assignTo(
        {
            colors: {
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    sliceTheme;

    return <DynamicForm />;
};
