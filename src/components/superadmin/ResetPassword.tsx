import { Field, Box, Input, Button, CloseButton, Dialog, Portal, Center } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";


type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    id: string,
}
type passwordreset = {
    password: string;
    confirmpassword: string;
}

export default function ResetPassword(props: Proptype) {

    const initialValues: passwordreset = {
        confirmpassword: '',
        password: ''
    };
    const navigate = useNavigate()



    const validate = (values: passwordreset) => {
        const errors: Partial<Record<keyof passwordreset, string>> = {};
        const trimmedPassword = values.password.trim();
        const confirmpassword = values.confirmpassword.trim();
        if (trimmedPassword === "") {
            errors.password = "Password is required";
        } else {
            if (trimmedPassword.length < 5) {
                errors.password = "Password must be atleast 5 characters";
            }
        }
        if (confirmpassword === "") {
            errors.confirmpassword = "Confirm password is required";
        } else {
            if (confirmpassword !== trimmedPassword) {
                errors.confirmpassword =
                    "Confirm password should match with password";
            }
        }
        return errors;
    }


    const onSubmit = async (values: passwordreset,
        actions: FormikHelpers<passwordreset>) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const request = {
                password: values.password.trim(),
                confirmpassword: values.confirmpassword.trim(),
            }
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/changemanagerpassword/${props.id}`, {
                method: 'PUT',
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
                    title: "Password reset successfully.",
                    type: "success",
                    duration: 2500,
                });
                props.onClose()
            } else {

                // localStorage.removeItem('token');
                // navigate('/');

            }
            actions.setSubmitting(false);
        } catch (error) {
            actions.setSubmitting(false);
            console.error("Error:", error);
        }
    }


    return (
        <Dialog.Root size={'xs'} trapFocus={false} open={props.isOpen}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Reset Password</Dialog.Title>
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
                                                    invalid={!!(touched.password && errors.password)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Password
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter password of the superadmin"
                                                        name="password"
                                                        type="text"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                       
                                                    />
                                                    {errors.password ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.password}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Field.Root required
                                                    invalid={!!(touched.confirmpassword && errors.confirmpassword)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Confirm Password
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Confirm Password"
                                                        name="confirmpassword"
                                                        type="password"
                                                        value={values.confirmpassword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.confirmpassword ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.confirmpassword}
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
                                                    Reset superadmin password
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
