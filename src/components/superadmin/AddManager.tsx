import {
  Field,
  Box,
  Input,
  Button,
  Flex,
  Text,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
type managervalue = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmpassword: string;
  assciatedHospitalBranch: string;
}

type optionvalue = {
  userid: string;
  name: string;
}

export default function AddManager() {
  const [options, setOptions] = useState<optionvalue[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [associatedBranch, setAssociatedBranch] = useState<optionvalue | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  const initialValues: managervalue = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
    assciatedHospitalBranch: ''
  };


  const navigate = useNavigate();
  const validate = (values: managervalue) => {
    const errors: Partial<Record<keyof managervalue, string>> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
    const phoneRegex = /^[1-9]\d{9}$/;
    const trimmedPassword = values.password.trim();
    const confirmpassword = values.confirmpassword.trim();

    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }

    if (values.email && !emailRegex.test(values.email)) {
      errors.email = 'Email should be valid';
    }
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
    if (!phoneRegex.test(values.phone)) {
      errors.phone = 'Phone number should be 10 digits';
    }
    if (!values.assciatedHospitalBranch) {
      errors.assciatedHospitalBranch = 'Associated branch is required';
    }
    return errors;
  }
  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
      const response: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/getallhospitalbranchesname`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: { success: boolean; data?: optionvalue[]; msg?: string } = await response.json();

      if (data.success === true) {
        setOptions(data.data || []);
      } else {
        // localStorage.removeItem("token");
        // navigate("/");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assciatedBrnchName = associatedBranch?.name ?? "";
  const displayBranchName =
    assciatedBrnchName.length > 45
      ? `${assciatedBrnchName.slice(0, 45)}…`
      : assciatedBrnchName;


  const onSubmit = async (values: managervalue,
    actions: FormikHelpers<managervalue>) => {

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      const request = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.toString().trim(),
        password: values.password.trim(),
        confirmpassword: values.confirmpassword.trim(),
        associatedHospitalBranch: values.assciatedHospitalBranch
      }
      // console.log(values.assciatedHospitalBranch)
      const response: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/addhospitalmanager`
        , {
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
          title: "Hospital manager created successfully.",
          type: "success",
          duration: 2500,
        });
        navigate('/superadmin/managers');
      } else {
        if (data.msg === "Hospital Manager with this email and phone already exists.") {
          toaster.create({
            title: "Hospital Manager with this email and phone already exists.",
            type: "error",
            duration: 2500,
          });
        }
        else if (data.msg === "Hospital Manager with this email already exists.") {
          toaster.create({
            title: "Hospital Manager with this email already exists.",
            type: "error",
            duration: 2500,
          });
        } else if (data.msg === "Hospital Manager with this phone already exists.") {
          toaster.create({
            title: "Hospital Manager with this phone already exists.",
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

  useEffect(() => {
    fetchOptions();
  }, [])



  return (
    <Box bgColor={"white"} boxShadow={"lg"} padding={8} borderRadius={"lg"}>
      <Box
        fontWeight={"bold"}
        fontFamily="Inter, sans-serif"
        fontSize={"xl"}
        marginBottom={4}
      >
        Register Hospital Manager
      </Box>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {
          ({ handleSubmit, values, errors, touched, handleChange, setFieldValue, handleBlur, isSubmitting }) =>
            <Form onSubmit={handleSubmit}>
              <Box
                display={"flex"}
                gap={8}
                flexDir={["column", "column", "column", "row"]}
                mb={4}
              >
                <Field.Root required invalid={!!(touched.name && errors.name)}>
                  <Field.Label fontWeight={"bold"}>
                    Name of the manager
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter name of the hospital"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={50}
                  />
                  {errors.name ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.name}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
                <Field.Root required invalid={!!(touched.email && errors.email)}>
                  <Field.Label fontWeight={"bold"}>
                    Email of the manager
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter email of the hospital"
                    name="email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.email}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
              </Box>
              <Box
                display={"flex"}
                gap={8}
                flexDir={["column", "column", "column", "row"]}
                mb={4}
              >
                <Field.Root invalid={!!(touched.password && errors.password)} required>
                  <Field.Label fontWeight={"bold"}>
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter password"
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
                <Field.Root invalid={!!(touched.confirmpassword && errors.confirmpassword)} required>
                  <Field.Label fontWeight={"bold"}>
                    Confirm Password
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name="confirmpassword"
                    placeholder="Confirm password"
                    type="text"
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
              </Box>
              <Box
                display={"flex"}
                gap={8}
                flexDir={["column", "column", "column", "row"]}
                mb={4}
              >
                <Field.Root invalid={!!(touched.phone && errors.phone)} required>
                  <Field.Label fontWeight={"bold"}>
                    Phone of the manager
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter phone number of the branch"
                    name="phone"
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
                    onChange={e => {
                      if (e.target.value.length <= 10) {
                        handleChange(e);
                      }
                    }}
                    value={values.phone}
                    onBlur={handleBlur}
                  />
                  {errors.phone ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.phone}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
                <Field.Root
                  invalid={!!(touched.assciatedHospitalBranch && errors.assciatedHospitalBranch)}
                  required
                >
                  <Field.Label fontWeight="bold">
                    Associated branch
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Box pos="relative" width={'full'}>
                    <Flex
                      align="center"
                      p={2}
                      border={touched.assciatedHospitalBranch && errors.assciatedHospitalBranch ? '2px solid red' : '1px solid'}
                      borderColor={touched.assciatedHospitalBranch && errors.assciatedHospitalBranch ? 'red' : 'gray.200'}
                      borderRadius="md"
                      bg="white"
                      wrap="wrap"
                      gap="1"
                      cursor="pointer"
                      width="100%"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {associatedBranch ? (

                        <Text fontFamily="Inter, sans-serif" title={assciatedBrnchName}>
                          {`${displayBranchName} , ${associatedBranch.userid}`}
                        </Text>
                      ) : (
                        <Text color="gray.400" fontSize={'sm'} fontFamily="Inter, sans-serif">
                          Branch associated with the manager
                        </Text>
                      )}
                      <Box ml="auto">{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</Box>
                    </Flex>

                    {isOpen && (
                      <Flex
                        direction="column"
                        p="2"
                        mt="1"
                        borderRadius="md"
                        boxShadow="md"
                        bg="white"
                        maxH="200px"
                        overflowY="auto"
                        width="100%"
                        position="absolute"
                        zIndex="10"
                      >
                        <Box>
                          <Input
                            placeholder="Search branches..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            mb={2}
                          />
                        </Box>
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map(opt => {
                            const userName = opt?.name ?? "";
                            const displayName =
                              userName.length > 45
                                ? `${userName.slice(0, 45)}…`
                                : userName;
                            return (
                              <Flex
                                key={opt.userid}
                                align="center"
                                p={2}
                                _hover={{ bg: 'gray.100' }}
                                cursor="pointer"
                                onClick={() => {
                                  setAssociatedBranch(opt);
                                  setFieldValue('assciatedHospitalBranch', opt.userid);
                                  setIsOpen(false);
                                }}
                              >
                                {associatedBranch?.userid === opt.userid && <FaCheck color="blue" />}
                                <Text title={userName} ml={2}>{`${displayName} , ${opt.userid}`}</Text>
                              </Flex>
                            )
                          }
                          )
                        ) : (
                          <Text p={2} color="gray.500">
                            No branches found
                          </Text>
                        )}
                      </Flex>
                    )}

                  </Box>

                  {errors.assciatedHospitalBranch && (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.assciatedHospitalBranch}
                    </Field.ErrorText>
                  )}
                </Field.Root>

              </Box>
              <Center mt={4}>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  colorPalette="blue"
                  width="full"
                >
                  Register Hospital Manager
                </Button>
              </Center>
            </Form>
        }
      </Formik>
    </Box>
  )
}
