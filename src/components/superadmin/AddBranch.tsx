import { Field, Box, Input, Button, CloseButton, Dialog, Portal, Center } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

type branch = {
    branchName: string;
    branchEmail: string;
    branchPhone: string;
    branchAddress: string;
}

export default function AddBranch(props: Proptype) {
    const navigate = useNavigate()
    const initialValues: branch = {
        branchName: '',
        branchEmail: '',
        branchPhone: '',
        branchAddress: ''
    };


    const onSubmit = async (values: branch,
        actions: FormikHelpers<branch>) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const request: branch = {
                branchName: values.branchName.trim(),
                branchEmail: values.branchEmail.trim(),
                branchPhone: values.branchPhone.toString().trim(),
                branchAddress: values.branchAddress.trim(),
            }
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/addbranch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            actions.setSubmitting(false);
            const data: { success: boolean; msg?: string } = await response.json();
            if (data.success) {
                actions.resetForm();
                toaster.create({
                    title: "Hospital Branch created successfully.",
                    type: "success",
                    duration: 2500,
                });
                props.setFetchAgain((prev) => !prev)
                props.onClose()
            } else {
                if (data.msg === "Hospital branch with this email already exists.") {
                    toaster.create({
                        title: "Hospital branch with this email already exists.",
                        type: "error",
                        duration: 2500,
                    });
                } else {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
            actions.setSubmitting(false);
        } catch (error) {
            actions.setSubmitting(false);
            console.error("Error:", error);
        }
    }
    const validate = (values: branch) => {
        const errors: Partial<Record<keyof branch, string>> = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
        const phoneRegex = /^[1-9]\d{9}$/;
        if (!values.branchName.trim()) {
            errors.branchName = 'Branch name is required';
        }
        if (values.branchEmail && !emailRegex.test(values.branchEmail)) {
            errors.branchEmail = 'Email should be valid';
        }

        if (!phoneRegex.test(values.branchPhone)) {
            errors.branchPhone = 'Phone number should be 10 digits';
        }

        if (!values.branchAddress.trim()) {
            errors.branchAddress = 'Branch address is required';
        }
        return errors;
    }

    return (
        <Dialog.Root open={props.isOpen} trapFocus={false}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"} fontFamily={"Georgia, serif"}>Add Hospital Branch</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            <Formik
                                enableReinitialize
                                initialValues={initialValues}
                                validate={validate}
                                onSubmit={onSubmit}
                            >
                                {
                                    ({ handleSubmit, values, errors, touched, handleChange, handleBlur, isSubmitting }) =>
                                        <Form onSubmit={handleSubmit}>
                                            <Box display={"flex"} flexDirection={"column"} gap={4}>
                                                <Field.Root required
                                                    invalid={!!(touched.branchName && errors.branchName)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Name
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter name of the branch"
                                                        name="branchName"
                                                        type="text"
                                                        value={values.branchName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        maxLength={50}
                                                    />
                                                    {errors.branchName ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.branchName}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Field.Root required
                                                    invalid={!!(touched.branchEmail && errors.branchEmail)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Email
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter email of the branch"
                                                        name="branchEmail"
                                                        type="text"
                                                        value={values.branchEmail}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.branchEmail ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.branchEmail}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Field.Root required
                                                    invalid={!!(touched.branchPhone && errors.branchPhone)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Phone Number
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter phone number of the branch"
                                                        name="branchPhone"
                                                        type="number"
                                                        css={{
                                                            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                                                WebkitAppearance: "none",
                                                                margin: 0,
                                                            },
                                                            /* For Firefox */
                                                            "&[type=number]": {
                                                                MozAppearance: "textfield",
                                                            },
                                                        }}
                                                        value={values.branchPhone}
                                                        onChange={e => {
                                                            if (e.target.value.length <= 10) {
                                                                handleChange(e);
                                                            }
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.branchPhone ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.branchPhone}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Field.Root required
                                                    invalid={!!(touched.branchAddress && errors.branchAddress)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Address
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter name of the branch"
                                                        name="branchAddress"
                                                        type="text"
                                                        value={values.branchAddress}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        maxLength={50}
                                                    />
                                                    {errors.branchAddress ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.branchAddress}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Button
                                                    type="submit"
                                                    loading={isSubmitting}
                                                    colorPalette="blue"
                                                    width="full"
                                                >
                                                    Register Hospital Branch
                                                </Button>
                                            </Box>
                                        </Form>
                                }
                            </Formik>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => { props.onClose(); }} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
