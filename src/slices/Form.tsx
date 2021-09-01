

import React from 'react';
import { Form } from '@blateral/b.kit';
import {
    FormDataErrors,
    FormData,
    FormFieldProps,
} from '@blateral/b.kit/lib/components/sections/Form';
import { ModxSlice } from 'utils/modx';

export interface MailInfo {
    targetMails?: string[];
    subjectText?: string;
    redirectUrl?: string;
}

type BgMode = 'full' | 'inverted';

export interface FormSliceType extends ModxSlice<'Form'> {
    isActive?: boolean;
    bgMode?: BgMode;
    submitLabel?: string;
    checkboxLabel?: string;

    subjectText?: string;
    redirectUrl?: string;
    targetMails?: string;

    // helpers to define component elements outside of slice
    submitAction?: (props: {
        isInverted?: boolean;
        isDisabled?: boolean;
        label?: string;
        additionalProps?: { type: 'submit'; as: 'button' | 'a' };
    }) => React.ReactNode;
    validation?: (values: FormData, errors: FormDataErrors) => FormDataErrors;
    yupValidationSchema?: any;
    onSubmit?: (props: { mail: MailInfo; data: FormData }) => void;
    fieldSettings?: {
        [key in keyof FormData]: FormFieldProps;
    };
}

export const FormSlice: React.FC<FormSliceType> = ({
    bgMode,
    subjectText,
    submitLabel,
    checkboxLabel,
    redirectUrl,
    targetMails,
    submitAction,
    yupValidationSchema,
    validation,
    onSubmit,
    fieldSettings,
}) => {
    return (
        <Form
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            formFields={{
                name: {
                    isRequired: fieldSettings?.name?.isRequired,
                    infoMessage: fieldSettings?.name?.infoMessage,
                    label: fieldSettings?.name?.label,
                },
                surname: {
                    isRequired: fieldSettings?.surname?.isRequired,
                    infoMessage: fieldSettings?.surname?.infoMessage,
                    label: fieldSettings?.surname?.label,
                },
                mail: {
                    isRequired: fieldSettings?.mail?.isRequired,
                    infoMessage: fieldSettings?.mail?.infoMessage,
                    label: fieldSettings?.mail?.label,
                },
                phone: {
                    isRequired: fieldSettings?.phone?.isRequired,
                    infoMessage: fieldSettings?.phone?.infoMessage,
                    label: fieldSettings?.phone?.label,
                },
                area: {
                    isRequired: fieldSettings?.area?.isRequired,
                    infoMessage: fieldSettings?.area?.infoMessage,
                    label: fieldSettings?.area?.label,
                },
            }}
            checkbox={{
                label: checkboxLabel,
            }}
            submitAction={
                submitAction && submitLabel
                    ? ({ isInverted, isDisabled, additionalProps }) =>
                          submitAction({
                              isInverted,
                              isDisabled,
                              additionalProps,
                              label: submitLabel,
                          })
                    : undefined
            }
            validation={
                validation
                    ? (values, errors) => validation(values, errors)
                    : undefined
            }
            yupValidationSchema={yupValidationSchema}
            onSubmit={(data) => {
                onSubmit &&
                    onSubmit({
                        mail: {
                            targetMails: targetMails
                                ?.replace(/\s+/g, '')
                                ?.split(','),
                            redirectUrl: redirectUrl || '',
                            subjectText: subjectText,
                        },
                        data,
                    });
            }}
        />
    );
};
