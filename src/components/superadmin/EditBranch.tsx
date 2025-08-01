import { Field, Box, Input, Button, CloseButton, Dialog, Portal, Center, Spinner } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
import type { branch } from "./BranchTable";
import { useEffect, useState } from "react";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    id: string;
    setBranches: React.Dispatch<React.SetStateAction<branch[]>>
}

type branchData = {
    branchName: string;
    branchEmail: string;
    branchPhone: string;
    branchAddress: string;
}

export default function EditBranch(props: Proptype) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [branch, setBranch] = useState<branchData | null>(null)

    const fetchBranchById = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/getbranchbyid/${props.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: branchData; msg?: string } = await response.json();
            if (data.success) {
                setBranch(data.data || null);
            } else {
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    }

    const onSubmit = async (values: branchData,
        actions: FormikHelpers<branchData>) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const request: branchData = {
                branchName: values.branchName.trim(),
                branchEmail: values.branchEmail.trim(),
                branchPhone: values.branchPhone.toString().trim(),
                branchAddress: values.branchAddress.trim(),
            }
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/editbranch/${props.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            actions.setSubmitting(false);
            const data: { success: boolean; data?: branch, msg?: string } = await response.json();
            if (data.success) {
                if (data.data) {
                    const updatedBranch = data.data;
                    props.setBranches((prevData) =>
                        prevData.map((item) =>
                            item.userid === props.id ? { ...item, name: updatedBranch.name, email: updatedBranch.email, updatedBy: updatedBranch.updatedBy, updatedAt: updatedBranch.updatedAt, phone: updatedBranch.phone, address: updatedBranch.address } : item
                        ))
                }

                // actions.resetForm();
                toaster.create({
                    title: "Hospital updated successfully.",
                    type: "success",
                    duration: 2500,
                });
                props.onClose()
            } else {
                if (data.msg === "Email is already in use by another hospital.") {
                    toaster.create({
                        title: "Hospital with this email already exists.",
                        type: "error",
                        duration: 2500,
                    });
                } else {
                    // localStorage.removeItem('token');
                    // navigate('/');
                }
            }
            actions.setSubmitting(false);


        } catch (error) {
            actions.setSubmitting(false);
            console.error("Error:", error);
        }
    }
    const validate = (values: branchData) => {
        const errors: Partial<Record<keyof branchData, string>> = {};
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

    useEffect(() => {
        fetchBranchById();
    }, [])

    return (
        <Dialog.Root open={props.isOpen}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    {loading ? (<Center>
                        <Spinner size="xl" />
                    </Center>) : <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"} fontFamily={"Georgia, serif"}>Edit Hospital Branch</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    branchName: branch?.branchName ?? "",
                                    branchEmail: branch?.branchEmail ?? "",
                                    branchPhone: branch?.branchPhone ?? "",
                                    branchAddress: branch?.branchAddress ?? ""
                                }}
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
                                                    Edit Hospital Branch
                                                </Button>
                                            </Box>
                                        </Form>
                                }
                            </Formik>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => { props.onClose(); }} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>}

                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
