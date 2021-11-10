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
    FileUpload as BkitFileUpload,
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
    isRequired?: boolean;
    type: FormFieldTypes;
    label?: string;
    column?: 'left' | 'right';
}

export interface Field extends FormField {
    type: 'Field';
    inputType?: 'text' | 'number' | 'email' | 'password' | 'tel';
    initialValue?: string;
    placeholder?: string;
    info?: string;
    icon?: { src: string; alt?: string };
    validate?: (value: string, config: Field) => Promise<string>;
    errorMsg?: string;
}

export interface Area extends FormField {
    type: 'Area';
    initialValue?: string;
    placeholder?: string;
    info?: string;
    validate?: (value: string, config: Area) => Promise<string>;
    errorMsg?: string;
}

export interface Select extends FormField {
    type: 'Select';
    initialValue?: string;
    placeholder?: string;
    dropdownItems: string;
    info?: string;
    icon?: { src: string; alt?: string };
    validate?: (value: string, config: Select) => Promise<string>;
    errorMsg?: string;
}

export interface Datepicker extends FormField {
    type: 'Datepicker';
    initialDate?: string;
    initialEndDate?: string;
    placeholder?: string;
    minDate?: string;
    maxDate?: string;
    singleSelect?: boolean;
    info?: string;
    icon?: { src: string; alt?: string };

    dateSubmitLabel?: string;
    dateDeleteLabel?: string;
    singleDateError?: string;
    multiDateError?: string;
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

export interface SubmitActionProps {
    isInverted?: boolean | undefined;
    label?: string;
    additionalProps?: { type: 'submit'; as: 'button' | 'a' };
    handleSubmit?: (() => Promise<any>) | undefined;
    isDisabled?: boolean | undefined;
}

export interface DatepickerSubmitActionProps {
    label?: string;
    handleSubmit?:
        | ((ev: React.SyntheticEvent<HTMLButtonElement>) => void)
        | undefined;
}

export interface DatepickerDeleteActionProps {
    label?: string;
    handleReset?:
        | ((ev: React.SyntheticEvent<HTMLButtonElement>) => void)
        | undefined;
}
export interface DynamicFormSliceType
    extends ModxSlice<'DynamicForm', FormField> {
    isActive?: boolean;
    theme?: Theme;
    bgColor?: string;
    bgMode?: 'full' | 'inverted';
    submitLabel?: string;
    buttonAs?: 'button' | 'a';
    targetEmails?: string;
    subjectLine?: string;
    successPage?: string;
    onSubmit?: (values: FormData) => Promise<void>;
    submitAction?: (props: SubmitActionProps) => React.ReactNode;
    datepickerSubmitAction?: (
        props?: DatepickerSubmitActionProps
    ) => React.ReactNode;
    datepickerDeleteAction?: (
        props: DatepickerDeleteActionProps
    ) => React.ReactNode;
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
    onValidate?: (value: unknown, config: FormField) => Promise<string>;
}

export const DynamicFormSlice: React.FC<DynamicFormSliceType> = ({
    theme,
    bgColor,
    bgMode,
    definitions,
    subjectLine,
    submitLabel,
    targetEmails,
    onSubmit,
    submitAction,
    datepickerSubmitAction,
    datepickerDeleteAction,
    items,
    onValidate,
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
            submitAction={createLabeledSubmitAction(submitAction, submitLabel)}
            fields={itemsToFormFields({
                formFields: items,
                onValidate,
                datepickerSubmitAction,
                datepickerDeleteAction,
            })}
            targetEmails={targetEmails}
            subjectLine={subjectLine}
            theme={sliceTheme}
            definitions={definitions as any}
        />
    );
};

const createLabeledSubmitAction = (
    submitAction?: (props: SubmitActionProps) => React.ReactNode,
    label?: string
) => {
    return submitAction
        ? ({ isInverted, isDisabled, handleSubmit }: SubmitActionProps) =>
              submitAction({
                  label: label || 'Submit',
                  handleSubmit,
                  isDisabled,
                  isInverted,
              })
        : undefined;
};

const itemsToFormFields = ({
    formFields,
    onValidate,
    datepickerSubmitAction,
    datepickerDeleteAction,
}: {
    formFields?: FormField[];
    onValidate?: (value: unknown, config: FormField) => Promise<string>;
    datepickerSubmitAction?: (
        props: DatepickerSubmitActionProps
    ) => React.ReactNode;
    datepickerDeleteAction?: (
        props: DatepickerDeleteActionProps
    ) => React.ReactNode;
}) => {
    if (!formFields) return {};

    return formFields.reduce(
        generateFormFieldMap({
            onValidate,
            datepickerSubmitAction,
            datepickerDeleteAction,
        }),
        {}
    );
};

const generateFormFieldMap =
    ({
        onValidate,
        datepickerSubmitAction,
        datepickerDeleteAction,
    }: {
        onValidate?: (value: unknown, config: FormField) => Promise<string>;
        datepickerSubmitAction?: (
            props: DatepickerSubmitActionProps
        ) => React.ReactNode;
        datepickerDeleteAction?: (
            props: DatepickerDeleteActionProps
        ) => React.ReactNode;
    }) =>
    (accumulator: Record<string, any>, formfield: FormField) => {
        if (isField(formfield)) {
            const field = createField(formfield, onValidate);
            return { ...accumulator, ...field };
        }
        if (isArea(formfield)) {
            const area = createArea(formfield, onValidate);
            return { ...accumulator, ...area };
        }
        if (isSelect(formfield)) {
            const select = createSelect(formfield, onValidate);
            return { ...accumulator, ...select };
        }

        if (isDatepicker(formfield)) {
            const fieldGroup = createDatePicker({
                formfield,
                onValidate,
                datepickerSubmitAction,
                datepickerDeleteAction,
            });
            return { ...accumulator, ...fieldGroup };
        }
        if (isFieldGroup(formfield)) {
            const fieldGroup = createFieldGroup(formfield, onValidate);
            return { ...accumulator, ...fieldGroup };
        }
        if (isUpload(formfield)) {
            const upload = createUpload(formfield, onValidate);
            return { ...accumulator, ...upload };
        }
        return accumulator;
    };

function createField(
    formfield: Field,
    onValidate?: (value: unknown, config: FormField) => Promise<string>
): Record<string, BkitField> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitField = {
        type: 'Field',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        icon: formfield.icon?.src ? { src: formfield.icon?.src } : undefined,
        validate: onValidate,
        column: formfield.column,
        initialValue: formfield.initialValue,
        inputType: formfield.inputType,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createArea(
    formfield: Area,
    onValidate?: (value: unknown, config: FormField) => Promise<string>
): Record<string, BkitArea> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitArea = {
        type: 'Area',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        validate: onValidate,
        column: formfield.column,
        initialValue: formfield.initialValue,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createSelect(
    formfield: Select,
    onValidate?: (value: unknown, config: FormField) => Promise<string>
): Record<string, BkitSelect> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const dropdownValues = formfield.dropdownItems.split(/\r?\n/);

    const formFieldValues: BkitSelect = {
        type: 'Select',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        initialValue: formfield.initialValue,
        dropdownItems: dropdownValues.map((value) => {
            return { label: value, value };
        }),
        column: formfield.column,
        validate: onValidate,
        errorMsg: formfield.errorMsg,
        icon: formfield.icon?.src ? { src: formfield.icon.src } : undefined,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createFieldGroup(
    formfield: FieldGroup,
    onValidate?: (value: unknown, config: FormField) => Promise<string>
): Record<string, BkitFieldGroup> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const fields =
        formfield?.fieldString
            ?.replace(/<p>/gi, '')
            ?.replace(/<\/p>/gi, '')
            ?.split(/\r?\n/)
            ?.map((value) => {
                return { initialChecked: false, text: value };
            }) || [];

    const formFieldValues: BkitFieldGroup = {
        type: 'FieldGroup',
        isRequired: formfield.isRequired,
        validate: onValidate,
        column: formfield.column,
        errorMsg: formfield.errorMsg,
        groupType: formfield.groupType,
        fields: fields,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

// FIXME:
function createDatePicker({
    formfield,
    onValidate,
    datepickerSubmitAction,
    datepickerDeleteAction,
}: {
    formfield: Datepicker;
    onValidate?: (value: unknown, config: FormField) => Promise<string>;
    datepickerSubmitAction?: (
        props: DatepickerSubmitActionProps
    ) => React.ReactNode;
    datepickerDeleteAction?: (
        props: DatepickerDeleteActionProps
    ) => React.ReactNode;
}): Record<string, BkitDatepicker> | undefined {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitDatepicker = {
        type: 'Datepicker',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        column: formfield.column,
        validate: onValidate,
        singleDateError: formfield.singleDateError,
        multiDateError: formfield.multiDateError,
        icon: formfield.icon?.src ? { src: formfield.icon.src } : undefined,
        initialDates: !formfield.singleSelect
            ? [
                  createDateFromDateString(formfield.initialDate),
                  createDateFromDateString(formfield.initialEndDate),
              ]
            : undefined,
        minDate: createDateFromDateString(formfield?.minDate),
        maxDate: createDateFromDateString(formfield?.maxDate),
        nextCtrlUrl: formfield.nextCtrlUrl,
        prevCtrlUrl: formfield.prevCtrlUrl,
        singleSelect: formfield.singleSelect,
        submitAction:
            datepickerSubmitAction && formfield.dateSubmitLabel
                ? (handleClick) =>
                      datepickerSubmitAction &&
                      datepickerSubmitAction({
                          handleSubmit: handleClick,
                          label: formfield.dateSubmitLabel,
                      })
                : undefined,
        deleteAction:
            datepickerDeleteAction && formfield.dateDeleteLabel
                ? (handleReset) =>
                      datepickerDeleteAction &&
                      datepickerDeleteAction({
                          handleReset,
                          label: formfield.dateDeleteLabel,
                      })
                : undefined,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
}

function createDateFromDateString(datestring?: string) {
    if (!datestring) return new Date();

    const dateparts = datestring
        .split('/')
        .map((datepart) => datepart.replace(/^0+/, ''));

    try {
        return new Date(+dateparts[0], +dateparts[1] - 1, +dateparts[2]);
    } catch (e) {
        console.error(e);
        return new Date();
    }
}

function createUpload(
    formfield: FileUploadField,
    onValidate?: (value: unknown, config: FormField) => Promise<string>
): Record<string, BkitFileUpload> {
    if (!formfield.label) return {};
    const formFieldData = {};

    const formFieldValues: BkitFileUpload = {
        type: 'Upload',
        isRequired: formfield.isRequired,
        info: formfield.info,
        column: formfield.column,
        validate: onValidate,
        addBtnLabel: formfield.addBtnLabel,
        removeBtnLabel: formfield.removeBtnLabel,
        acceptedFormats: formfield.acceptedFormats,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
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
