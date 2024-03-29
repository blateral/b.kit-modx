import React, { useMemo } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { isValidArray } from '@blateral/b.kit/lib/hooks';
import {
    FieldGenerationProps,
    FormStructure,
    FormValues,
    Select,
    SubmitResponse,
} from '@blateral/b.kit/types/components/sections/form/DynamicForm';
import {
    Field as BkitField,
    Area as BkitArea,
    Select as BkitSelect,
    Datepicker as BkitDatepicker,
    FieldGroup as BkitFieldGroup,
    FileUpload as BkitFileUpload,
    Location as BkitLocation,
} from '@blateral/b.kit/types/components/sections/form/DynamicForm';
import { LocationData } from '@blateral/b.kit/types/components/fields/LocationField';

import { ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const DynamicForm = React.lazy(() => import('imports/_DynamicForm'));

type FormFieldTypes =
    | 'Field'
    | 'ReplyToMailField'
    | 'Area'
    | 'Select'
    | 'RecipientSelect'
    | 'Datepicker'
    | 'FieldGroup'
    | 'Upload'
    | 'Location';

export interface FormField {
    isRequired?: boolean;
    type: FormFieldTypes;
    label?: string;
}

export interface ModxField extends FormField {
    type: 'Field';
    inputType?: 'text' | 'number' | 'email' | 'password' | 'tel';
    initialValue?: string;
    placeholder?: string;
    info?: string;
    errorMsg?: string;
}

export interface ModxReplyToMailField extends FormField {
    type: 'ReplyToMailField';
    inputType?: 'email';
    initialValue?: string;
    placeholder?: string;
    info?: string;
    errorMsg?: string;
    isRequired: true;
}

export interface ModxArea extends FormField {
    type: 'Area';
    initialValue?: string;
    placeholder?: string;
    info?: string;
    errorMsg?: string;
}

export interface ModxSelect extends FormField {
    type: 'Select' | 'RecipientSelect';
    initial?: string;
    placeholder?: string;
    dropdownItems: string;
    info?: string;
    errorMsg?: string;
}

export interface ModxDatepicker extends FormField {
    type: 'Datepicker';
    initialDate?: string;
    initialEndDate?: string;
    placeholder?: string;
    minDate?: string;
    maxDate?: string;
    singleSelect?: boolean;
    info?: string;

    dateSubmitLabel?: string;
    dateDeleteLabel?: string;
    singleDateError?: string;
    multiDateError?: string;
    nextCtrlUrl?: string;
    prevCtrlUrl?: string;
}

export interface ModxLocation extends FormField {
    type: 'Location';
    mapZoom?: string;
    initialMapCenter?: string;
    placeholder?: string;
    info?: string;
    errorMsg?: string;
    toggleLabel?: string;
    trackLocationBtnLabel?: string;
}

export interface ModxFieldGroup extends FormField {
    type: 'FieldGroup';
    groupType: 'Radio' | 'Checkbox';
    fields: Array<{ initialChecked?: boolean; text?: string }>;
    fieldString?: string;
    errorMsg?: string;
    info?: string;
}

export interface ModxFileUploadField extends FormField {
    type: 'Upload';
    addBtnLabel?: string;
    removeBtnLabel?: string;
    info?: string;
    acceptedFormats?: string;
    errorMsg?: string;
}

export interface FormData {
    [key: string]:
        | string
        | boolean
        | Array<string>
        | [Date | null, Date | null]
        | File[]
        | LocationData;
}

export interface SubmitActionProps {
    isInverted?: boolean | undefined;
    label?: string;
    additionalProps?: { type: 'submit'; as: 'button' | 'a' };
    handleSubmit?: (() => Promise<any>) | undefined;
    isSubmitting?: boolean | undefined;
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

export interface LocationToggleProps {
    toggleLabel?: string;
    handleToggle?:
        | ((ev: React.SyntheticEvent<HTMLButtonElement>) => void)
        | undefined;
    isInverted?: boolean;
    viewState?: 'desc' | 'map';
}

export interface LocationTrackingProps {
    label?: string;
    handleToggle?:
        | ((ev: React.SyntheticEvent<HTMLButtonElement>) => void)
        | undefined;
    isInverted?: boolean;
}

export interface FieldSettings {
    field?: Pick<BkitField, 'validate'>;
    replyToMailField?: Pick<BkitField, 'validate'>;
    area?: Pick<BkitArea, 'validate'>;
    select?: Pick<BkitSelect, 'validate' | 'indicator'>;
    datepicker?: Pick<BkitDatepicker, 'validate' | 'customIcon'> & {
        submitAction?: (props: DatepickerSubmitActionProps) => React.ReactNode;
        deleteAction?: (props: DatepickerDeleteActionProps) => React.ReactNode;
    };
    checkbox?: Pick<BkitFieldGroup, 'validate'>;
    radio?: Pick<BkitFieldGroup, 'validate'>;
    upload?: Pick<
        BkitFileUpload,
        'validate' | 'customUploadIcon' | 'customDeleteIcon'
    >;
    location?: Pick<BkitLocation, 'validate' | 'customResetControl'> & {
        customToggle?: (props: LocationToggleProps) => React.ReactNode;
        customLocationControl?: (
            props: LocationTrackingProps
        ) => React.ReactNode;
    };
}

export interface DynamicFormSliceType
    extends ModxSlice<'DynamicForm', FormField> {
    isActive?: boolean;
    anchorId?: string;
    theme?: ThemeMods;
    bgColor?: string;
    bgMode?: 'full' | 'inverted';
    submitLabel?: string;
    buttonAs?: 'button' | 'a';
    targetEmails?: string;
    subjectLine?: string;
    successPage?: string;
    onSubmit?: (values: FormData) => Promise<SubmitResponse>;
    submitAction?: (props: SubmitActionProps) => React.ReactNode;
    definitions?: {
        field?: (props: FieldGenerationProps<BkitField>) => React.ReactNode;
        area?: (props: FieldGenerationProps<BkitArea>) => React.ReactNode;
        select?: (props: FieldGenerationProps<BkitSelect>) => React.ReactNode;
        datepicker?: (
            props: FieldGenerationProps<BkitDatepicker>
        ) => React.ReactNode;
        checkbox?: (
            props: FieldGenerationProps<BkitFieldGroup>
        ) => React.ReactNode;
        radio?: (
            props: FieldGenerationProps<BkitFieldGroup>
        ) => React.ReactNode;
        upload?: (
            props: FieldGenerationProps<BkitFileUpload>
        ) => React.ReactNode;
        location?: (
            props: FieldGenerationProps<BkitLocation>
        ) => React.ReactNode;
    };
    settings: FieldSettings;
}

export const DynamicFormSlice: React.FC<DynamicFormSliceType> = ({
    theme,
    anchorId,
    bgColor,
    bgMode,
    definitions,
    settings,
    subjectLine,
    submitLabel,
    targetEmails,
    onSubmit,
    submitAction,
    items,
}) => {
    const fields = useMemo(() => items || [], [items]);

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

    const formFields: FormStructure = useMemo(
        () =>
            itemsToFormFields({
                formFields: fields,
                fieldSettings: settings,
            }),
        [fields, settings]
    );

    return (
        <DynamicForm
            bgMode={bgMode}
            anchorId={normalizeAnchorId(anchorId)}
            onSubmit={async (values) => {
                // adding target mails from recipient field
                const recipientTargetMails = getTargetMailsFromField(
                    fields,
                    formFields,
                    values
                );

                // get reply to mail
                const replyToMail = getReplyToMailField(fields, values);
                if (replyToMail) {
                    values.replyToMail = replyToMail;
                }

                if (isValidArray(recipientTargetMails, false)) {
                    const targetMails = recipientTargetMails?.filter(
                        (v, i, a) => a.indexOf(v) === i
                    );
                    values.targetEmails = targetMails;
                }

                return (await onSubmit?.(values as FormData)) || {};
            }}
            submitAction={createLabeledSubmitAction(submitAction, submitLabel)}
            fields={formFields}
            targetEmails={targetEmails?.split(',')}
            subjectLine={subjectLine}
            theme={sliceTheme}
            definitions={definitions as any}
        />
    );
};

const getReplyToMailField = (items: FormField[], values: FormValues) => {
    let replyToMail = '';
    const field = items.find(
        (field) => field.type === 'ReplyToMailField'
    ) as ModxReplyToMailField;

    // get current value
    if (field?.label) {
        replyToMail = values[field?.label].toString();
    }

    return replyToMail;
};

const getTargetMailsFromField = (
    items: FormField[],
    formFields: FormStructure,
    values: FormValues
) => {
    const targetMails: string[] = [];

    // find recipient mail select field
    const recipientField = items.find(
        (field) => field.type === 'RecipientSelect'
    ) as ModxSelect;

    // get current value
    if (recipientField?.label) {
        const definition: Select = formFields[recipientField?.label];
        const value = values[recipientField?.label];

        // find selected option defintion
        const data = definition.dropdownItems.find(
            (item) => item.label === value
        );

        if (
            data?.value?.recipients &&
            typeof data?.value?.recipients === 'string'
        ) {
            const mails = data?.value?.recipients
                ?.split(',')
                ?.map((mail) => mail.replace(/\s/g, ''));

            if (isValidArray(mails, false)) {
                targetMails.push(...mails);
            }
        }
    }

    return targetMails;
};

const createLabeledSubmitAction = (
    submitAction?: (props: SubmitActionProps) => React.ReactNode,
    label?: string
) => {
    return submitAction
        ? ({ isInverted, isSubmitting, handleSubmit }: SubmitActionProps) =>
              submitAction({
                  label: label || 'Submit',
                  handleSubmit,
                  isSubmitting,
                  isInverted,
              })
        : undefined;
};

const itemsToFormFields = ({
    formFields,
    fieldSettings,
}: {
    formFields?: FormField[];
    fieldSettings?: FieldSettings;
}) => {
    if (!formFields) return {};

    // make sure all form settings have valid labels (keys for the DynamicForm component)
    formFields = formFields.reduce<FormField[]>((acc, current) => {
        try {
            if (
                current.label === 'targetEmails' ||
                current.label === 'recipientId' ||
                current.label === 'subjectLine' ||
                current.label === 'successPageUrl' ||
                current.label === 'replyToMail'
            ) {
                throw new Error('Cannot use reserved form field labels!');
            }

            if (!acc.find((field) => field.label === current.label)) {
                return [...acc, current];
            } else {
                throw new Error(`Dublicate form field label: ${current.label}`);
            }
        } catch (err) {
            console.warn(err);
            return acc;
        }
    }, []);

    return formFields.reduce(
        generateFormFieldMap({
            fieldSettings,
        }),
        {}
    );
};

const generateFormFieldMap =
    ({ fieldSettings }: { fieldSettings?: FieldSettings }) =>
    (accumulator: Record<string, any>, formfield: FormField) => {
        if (isField(formfield)) {
            const field = createField(formfield, fieldSettings);
            return { ...accumulator, ...field };
        }

        if (isReplyToEmailField(formfield)) {
            const field = createReplyToMailField(formfield, fieldSettings);
            return { ...accumulator, ...field };
        }

        if (isArea(formfield)) {
            const area = createArea(formfield, fieldSettings);
            return { ...accumulator, ...area };
        }

        if (isSelect(formfield)) {
            const select = createSelect(formfield, fieldSettings);
            return { ...accumulator, ...select };
        }

        if (isRecipientSelect(formfield)) {
            const select = createRecipientSelect(formfield, fieldSettings);
            return { ...accumulator, ...select };
        }

        if (isDatepicker(formfield)) {
            const fieldGroup = createDatePicker({
                formfield,
                settings: fieldSettings,
            });
            return { ...accumulator, ...fieldGroup };
        }

        if (isFieldGroup(formfield)) {
            const fieldGroup = createFieldGroup(formfield, fieldSettings);
            return { ...accumulator, ...fieldGroup };
        }

        if (isUpload(formfield)) {
            const upload = createUpload({
                formfield,
                settings: fieldSettings,
            });
            return { ...accumulator, ...upload };
        }

        if (isLocation(formfield)) {
            const location = createLocation({
                formfield,
                settings: fieldSettings,
            });
            return { ...accumulator, ...location };
        }
        return accumulator;
    };

const createField = (
    formfield: ModxField,
    settings?: FieldSettings
): Record<string, BkitField> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitField = {
        type: 'Field',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        validate: settings?.field?.validate,
        initialValue: formfield.initialValue,
        inputType: formfield.inputType,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createReplyToMailField = (
    formfield: ModxReplyToMailField,
    settings?: FieldSettings
): Record<string, BkitField> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitField = {
        type: 'Field',
        placeholder: formfield.placeholder,
        isRequired: true,
        info: formfield.info,
        validate: settings?.replyToMailField?.validate,
        initialValue: formfield.initialValue,
        inputType: formfield.inputType,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createArea = (
    formfield: ModxArea,
    settings?: FieldSettings
): Record<string, BkitArea> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const formFieldValues: BkitArea = {
        type: 'Area',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        validate: settings?.area?.validate,
        initialValue: formfield.initialValue,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createSelect = (
    formfield: ModxSelect,
    settings?: FieldSettings
): Record<string, BkitSelect> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const dropdownValues = formfield.dropdownItems.split(/\r?\n/);

    const formFieldValues: BkitSelect = {
        type: 'Select',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        initialOption: formfield.initial,
        dropdownItems: dropdownValues.map((value) => {
            return { label: value, value: { text: value } };
        }),
        validate: settings?.select?.validate,
        indicator: settings?.select?.indicator,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createRecipientSelect = (
    formfield: ModxSelect,
    settings?: FieldSettings
): Record<string, BkitSelect> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const options = formfield.dropdownItems.split(/\r?\n/);

    const formFieldValues: BkitSelect = {
        type: 'Select',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        initialOption: formfield.initial,
        dropdownItems: options.map((option) => {
            const keyValues = option.trim().split(/\r?==/);
            const key = keyValues?.[0] || option;
            const value = keyValues?.[1] || '';

            return { label: key, value: { text: key, recipients: value } };
        }),
        validate: settings?.select?.validate,
        indicator: settings?.select?.indicator,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createFieldGroup = (
    formfield: ModxFieldGroup,
    settings?: FieldSettings
): Record<string, BkitFieldGroup> | undefined => {
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

    const type = formfield.groupType;

    const formFieldValues: BkitFieldGroup = {
        type: 'FieldGroup',
        isRequired: formfield.isRequired,
        validate:
            type === 'Checkbox'
                ? settings?.checkbox?.validate
                : settings?.radio?.validate,
        errorMsg: formfield.errorMsg,
        groupType: formfield.groupType,
        fields: fields,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createDatePicker = ({
    formfield,
    settings,
}: {
    formfield: ModxDatepicker;
    settings?: FieldSettings;
}): Record<string, BkitDatepicker> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const submitAction = settings?.datepicker?.submitAction;
    const deleteAction = settings?.datepicker?.deleteAction;

    const formFieldValues: BkitDatepicker = {
        type: 'Datepicker',
        placeholder: formfield.placeholder,
        isRequired: formfield.isRequired,
        info: formfield.info,
        validate: settings?.datepicker?.validate,
        singleDateError: formfield.singleDateError,
        multiDateError: formfield.multiDateError,
        initialDates: !formfield.singleSelect
            ? [
                  createDateFromDateString(formfield.initialDate),
                  createDateFromDateString(formfield.initialEndDate),
              ]
            : undefined,
        minDate: createDateFromDateString(formfield?.minDate),
        maxDate: formfield?.maxDate
            ? createDateFromDateString(formfield?.maxDate)
            : undefined,
        nextCtrlUrl: formfield.nextCtrlUrl,
        prevCtrlUrl: formfield.prevCtrlUrl,
        singleSelect: formfield.singleSelect,
        customIcon: settings?.datepicker?.customIcon,
        submitAction:
            submitAction && formfield.dateSubmitLabel
                ? (handleClick) =>
                      submitAction({
                          handleSubmit: handleClick,
                          label: formfield.dateSubmitLabel,
                      })
                : undefined,
        deleteAction:
            deleteAction && formfield.dateDeleteLabel
                ? (handleReset) =>
                      deleteAction &&
                      deleteAction({
                          handleReset,
                          label: formfield.dateDeleteLabel,
                      })
                : undefined,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createDateFromDateString = (datestring?: string) => {
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
};

const createUpload = ({
    formfield,
    settings,
}: {
    formfield: ModxFileUploadField;
    settings?: FieldSettings;
}): Record<string, BkitFileUpload> => {
    if (!formfield.label) return {};
    const formFieldData = {};

    const formFieldValues: BkitFileUpload = {
        type: 'Upload',
        isRequired: formfield.isRequired,
        info: formfield.info,
        validate: settings?.upload?.validate,
        customUploadIcon: settings?.upload?.customUploadIcon,
        customDeleteIcon: settings?.upload?.customDeleteIcon,
        addBtnLabel: formfield.addBtnLabel,
        removeBtnLabel: formfield.removeBtnLabel,
        acceptedFormats: formfield.acceptedFormats,
        errorMsg: formfield.errorMsg,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const createLocation = ({
    formfield,
    settings,
}: {
    formfield: ModxLocation;
    settings?: FieldSettings;
}): Record<string, BkitLocation> | undefined => {
    if (!formfield.label) return undefined;
    const formFieldData = {};

    const center = formfield.initialMapCenter?.split(',');
    const customToggle = settings?.location?.customToggle;
    const customResetControl = settings?.location?.customResetControl;
    const customLocationControl = settings?.location?.customLocationControl;

    const formFieldValues: BkitLocation = {
        type: 'Location',
        isRequired: formfield.isRequired,
        info: formfield.info,
        errorMsg: formfield.errorMsg,
        placeholder: formfield.placeholder,
        initialMapCenter:
            center && center.length > 1 ? [+center[0], +center[1]] : undefined,
        zoom: formfield.mapZoom ? +formfield.mapZoom : undefined,
        toggleLabel: formfield.toggleLabel,
        trackLocationLabel: formfield.trackLocationBtnLabel,
        validate: settings?.location?.validate,
        customToggle:
            customToggle && formfield.toggleLabel
                ? ({ isInverted, viewState, handleClick }) =>
                      customToggle({
                          isInverted,
                          viewState,
                          handleToggle: handleClick,
                          toggleLabel: formfield.toggleLabel,
                      })
                : undefined,
        customResetControl: customResetControl
            ? ({ isInverted, handleClick }) =>
                  customResetControl({
                      isInverted,
                      handleClick,
                  })
            : undefined,
        customLocationControl:
            customLocationControl && formfield.trackLocationBtnLabel
                ? ({ isInverted, handleClick }) =>
                      customLocationControl({
                          isInverted,
                          handleToggle: handleClick,
                          label: formfield.trackLocationBtnLabel,
                      })
                : undefined,
    };

    formFieldData[formfield.label] = formFieldValues;

    return formFieldData;
};

const isField = (formfield: FormField): formfield is ModxField => {
    return formfield.type === 'Field';
};

const isReplyToEmailField = (
    formfield: FormField
): formfield is ModxReplyToMailField => {
    return formfield.type === 'ReplyToMailField';
};

const isArea = (formfield: FormField): formfield is ModxArea => {
    return formfield.type === 'Area';
};

const isSelect = (formfield: FormField): formfield is ModxSelect => {
    return formfield.type === 'Select';
};

const isRecipientSelect = (formfield: FormField): formfield is ModxSelect => {
    return formfield.type === 'RecipientSelect';
};

const isDatepicker = (formfield: FormField): formfield is ModxDatepicker => {
    return formfield.type === 'Datepicker';
};

const isFieldGroup = (formfield: FormField): formfield is ModxFieldGroup => {
    return formfield.type === 'FieldGroup';
};

const isUpload = (formfield: FormField): formfield is ModxFileUploadField => {
    return formfield.type === 'Upload';
};

const isLocation = (formfield: FormField): formfield is ModxLocation => {
    return formfield.type === 'Location';
};
