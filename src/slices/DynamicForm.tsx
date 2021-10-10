import { assignTo, DynamicForm, Theme } from '@blateral/b.kit';
import {
    FieldGenerationProps,
    FileUpload,
} from '@blateral/b.kit/lib/components/sections/DynamicForm';
import React from 'react';
import {
    Field as BkitField,
    Area as BkitArea,
    Select as BkitSelect,
    Datepicker as BkitDatepicker,
    FieldGroup as BkitFieldGroup,
} from '@blateral/b.kit/lib/components/sections/DynamicForm';
import { ModxSlice } from '../utils/modx';

type FormFieldTypes =
    | 'Field'
    | 'Area'
    | 'Select'
    | 'Datepicker'
    | 'FieldGroup'
    | 'Upload';

export interface FormField {
    fuck: BkitDatepicker;
    isRequired?: boolean;
    type: FormFieldTypes;
    label?: string;
    column?: 'left' | 'right';
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
    dropdownItems: string;
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
    fieldString?: string;
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

export interface DynamicFormSliceType
    extends ModxSlice<'DynamicForm', FormField> {
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
        field?: (props: FieldGenerationProps<BkitField>) => React.ReactNode;
        area?: (props: FieldGenerationProps<BkitArea>) => React.ReactNode;
        select?: (props: FieldGenerationProps<BkitSelect>) => React.ReactNode;
        datepicker?: (
            props: FieldGenerationProps<Datepicker>
        ) => React.ReactNode;
        checkbox?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
        radio?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
        upload?: (props: FieldGenerationProps<FieldGroup>) => React.ReactNode;
    };
}

export const DynamicFormSlice: React.FC<DynamicFormSliceType> = ({
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

    const formFieldsData: Record<string, BkitField | BkitArea | BkitSelect> =
        itemsToFormFields(items);

    return (
        <DynamicForm
            bgMode={bgMode}
            onSubmit={onSubmit}
            submitAction={submitAction}
            theme={sliceTheme}
            definitions={definitions}
            fields={formFieldsData}
        />
    );
};

const itemsToFormFields = (formFields?: FormField[]) => {
    if (!formFields) return {};

    return formFields.reduce(generateFormFieldMap, {});
};

const generateFormFieldMap = (
    accumulator: Record<string, any>,
    formfield: FormField
) => {
    if (isField(formfield)) {
        const field = createField(formfield);
        return { ...accumulator, ...field };
    }
    if (isArea(formfield)) {
        const area = createArea(formfield);
        return { ...accumulator, ...area };
    }
    if (isSelect(formfield)) {
        const select = createSelect(formfield);
        return { ...accumulator, ...select };
    }

    // if (isDatepicker(formfield)) return createDatePicker(formfield);
    if (isFieldGroup(formfield)) {
        const fieldGroup = createFieldGroup(formfield);
        return { ...accumulator, ...fieldGroup };
    }
    // if (isUpload(formfield)) return createUpload(formfield);
    return accumulator;
};

function createField(formfield: Field): Record<string, BkitField> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitField = {
        type: 'Field',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        icon: formfield.icon?.src ? { src: formfield.icon?.src } : undefined,
        validate: formfield.validate,
        column: formfield.column,
        initalValue: formfield.initalValue,
        inputType: formfield.inputType,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createArea(formfield: Area): Record<string, BkitArea> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitArea = {
        type: 'Area',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        validate: formfield.validate,
        column: formfield.column,
        initalValue: formfield.initalValue,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createSelect(
    formfield: Select
): Record<string, BkitSelect> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const dropdownValues = formfield.dropdownItems.split(/\r?\n/);

    const formFieldValues: BkitSelect = {
        type: 'Select',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        initalValue: formfield.initalValue,
        dropdownItems: dropdownValues.map((value) => {
            return { label: value, value };
        }),
        column: formfield.column,
        validate: formfield.validate as any,
        errorMsg: formfield.errorMsg,
        icon: formfield.icon?.src ? { src: formfield.icon.src } : undefined,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createFieldGroup(
    formfield: FieldGroup
): Record<string, BkitFieldGroup> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const fields =
        formfield?.fieldString?.split(/\r?\n/)?.map((value) => {
            return { initialChecked: false, text: value };
        }) || [];

    const formFieldValues: BkitFieldGroup = {
        type: 'FieldGroup',
        isRequired: formfield.isRequired,
        validate: formfield.validate,
        column: formfield.column,
        errorMsg: formfield.errorMsg,
        groupType: formfield.groupType,
        fields: fields,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

// function createDatePicker(formfield: Datepicker): Record<string, BkitDatepicker> |undefined {

//     if (!formfield.label) return undefined;
//     const formFieldData = {};

//     const formFieldValues: BkitDatepicker = {
//         type: "Datepicker",
//         placeholder: formfield.placeholder,
//         isRequired: formfield.isRequired,
//         info: formfield.info,
//         column: formfield.column,
//         validate: formfield.validate,
//         icon: formfield.icon?.src? {src: formfield.icon.src} : undefined,
//     };

//     formFieldData[formfield.label] = formFieldValues

//     return formFieldData
// }

// function createUpload(formfield: FileUploadField): any {
//     throw new Error('Function not implemented.');
// }

const isField = (formfield: FormField): formfield is Field => {
    return formfield.type === 'Field';
};

const isArea = (formfield: FormField): formfield is Area => {
    return formfield.type === 'Area';
};

const isSelect = (formfield: FormField): formfield is Select => {
    return formfield.type === 'Select';
};

// const isDatepicker = (formfield: FormField): formfield is Datepicker => {
//     return formfield.type === 'Datepicker';
// };

const isFieldGroup = (formfield: FormField): formfield is FieldGroup => {
    return formfield.type === 'FieldGroup';
};

// const isUpload = (formfield: FormField): formfield is FileUploadField => {
//     return formfield.type === 'Upload';
// };
