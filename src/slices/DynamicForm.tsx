import { assignTo, DynamicForm, Theme } from '@blateral/b.kit';
import {
    FieldGenerationProps,
    FileUpload,
    FormStructure,
} from '@blateral/b.kit/lib/components/sections/DynamicForm';
import React from 'react';
import { Field as BkitField } from '@blateral/b.kit/lib/components/sections/DynamicForm';
import { ModxSlice } from '../utils/modx';

type FormFieldTypes =
    | 'Field'
    | 'Area'
    | 'Select'
    | 'Datepicker'
    | 'FieldGroup'
    | 'Upload';

export interface FormField {
    isRequired?: boolean;
    type: FormFieldTypes;
    label?: string;
}

export interface Field extends FormField {
    type: 'Field';
    inputType?: 'text' | 'number' | 'email' | 'password' | 'tel';
    initalValue?: string;
    placeholder?: string;
    info?: string;
    icon?: { src: string; alt?: string };
    validate?: (value: string, config: Field) => Promise<string>;
    errorMsg?: string;
}

export interface Area extends FormField {
    type: 'Area';
    initalValue?: string;
    placeholder?: string;
    info?: string;
    validate?: (value: string, config: Area) => Promise<string>;
    errorMsg?: string;
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
    validate?: (value: string, config: Select) => Promise<string>;
    errorMsg?: string;
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

    singleDateError?: string;
    mutliDateError?: string;
    nextCtrlUrl?: string;
    prevCtrlUrl?: string;
    validate?: (
        value: [Date | null, Date | null],
        config: Datepicker
    ) => Promise<string>;
    deleteAction?: (
        handleClick: (e: React.SyntheticEvent<HTMLButtonElement, Event>) => void
    ) => React.ReactNode;
    submitAction?: (
        handleClick?: (
            e: React.SyntheticEvent<HTMLButtonElement, Event>
        ) => void
    ) => React.ReactNode;
}

export interface FieldGroup extends FormField {
    type: 'FieldGroup';
    groupType: 'Radio' | 'Checkbox';
    fields: Array<{ initialChecked?: boolean; text?: string }>;

    validate?: (
        value: Array<string> | string,
        config: FieldGroup
    ) => Promise<string>;
    errorMsg?: string;
}

export interface FileUploadField extends FormField {
    type: 'Upload';
    addBtnLabel?: string;
    removeBtnLabel?: string;
    info?: string;
    acceptedFormats?: string;
    validate?: (value: Array<File>, config: FileUpload) => Promise<string>;
    errorMsg?: string;
}

export interface FormData {
    [key: string]:
        | string
        | boolean
        | Array<string>
        | [Date | null, Date | null];
}

export interface DynamicFormSlice extends ModxSlice<'DynamicForm', FormField> {
    isActive?: boolean;
    theme?: Theme;
    bgColor?: string;
    bgMode?: 'full' | 'inverted';
    onSubmit?: (values: FormData) => Promise<void>;
    submitAction?: (props: {
        isInverted?: boolean | undefined;
        handleSubmit?: (() => Promise<any>) | undefined;
        isDisabled?: boolean | undefined;
    }) => React.ReactNode;
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

export const ArticleSlice: React.FC<DynamicFormSlice> = ({
    theme,
    bgColor,
    bgMode,
    definitions,
    onSubmit,
    submitAction,
    items,
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

    return (
        <DynamicForm
            bgMode={bgMode}
            onSubmit={onSubmit}
            submitAction={submitAction}
            theme={sliceTheme}
            definitions={definitions}
        />
    );
};

const itemsToFormFields = (formFields?: FormField[]) => {
    if (!formFields) return {};

    return formFields.map((formfield) => {
        if (isField(formfield)) return createField(formfield);
        if (isArea(formfield)) return createArea(formfield);
        if (isSelect(formfield)) return createSelect(formfield);
        if (isDatepicker(formfield)) return createDatePicker(formfield);
        if (isFieldGroup(formfield)) return createFieldGroup(formfield);
        if (isUpload(formfield)) return createUpload(formfield);
    });
};

function createField(formfield: Field): BkitField | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    formFieldData[formfield.label] = {
        type: 'Field',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        icon: formfield.icon?.src ? { src: formfield.icon?.src } : undefined,
        validate: formfield.validate,
    };

    return formFieldData as any;
}

function createArea(formfield: Area): any {
    throw new Error('Function not implemented.');
}

function createSelect(formfield: Select): any {
    throw new Error('Function not implemented.');
}

function createDatePicker(formfield: Datepicker): any {
    throw new Error('Function not implemented.');
}

function createFieldGroup(formfield: FieldGroup): any {
    throw new Error('Function not implemented.');
}

function createUpload(formfield: FileUploadField): any {
    throw new Error('Function not implemented.');
}

const isField = (formfield: FormField): formfield is Field => {
    return formfield.type === 'Field';
};

const isArea = (formfield: FormField): formfield is Area => {
    return formfield.type === 'Area';
};

const isSelect = (formfield: FormField): formfield is Select => {
    return formfield.type === 'Select';
};

const isDatepicker = (formfield: FormField): formfield is Datepicker => {
    return formfield.type === 'Datepicker';
};

const isFieldGroup = (formfield: FormField): formfield is FieldGroup => {
    return formfield.type === 'FieldGroup';
};

const isUpload = (formfield: FormField): formfield is FileUploadField => {
    return formfield.type === 'Upload';
};
