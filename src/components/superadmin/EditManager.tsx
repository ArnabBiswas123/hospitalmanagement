import {
  Field,
  Box,
  Input,
  Button,
  Flex,
  Text,
  Center,
  Spinner
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import ResetPassword from "./ResetPassword";
type managerdata = {
  name: string;
  email: string;
  phone: string;
  associatedHospitalBranch: string;
}

type optionvalue = {
  userid: string;
  name: string;
}

type propsvalue = {
  managerid: string
}

type ApiManagerData = {
  name: string;
  email: string;
  phone: string;
  associatedHospitalBranch: { userid: string; name: string };
}

export default function EditManager(props: propsvalue) {
  const [options, setOptions] = useState<optionvalue[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [manager, setManager] = useState<managerdata | null>(null)
  const [associatedBranch, setAssociatedBranch] = useState<optionvalue | null>(null);
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false)




  const navigate = useNavigate();


  const fetchManagerById = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      setLoading(true);
      const response: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/gethospitalmanagerbyid/${props.managerid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      const data: { success: boolean; data?: ApiManagerData; msg?: string } = await response.json();
      if (data.success) {
        const mgr: managerdata = {
          name: data?.data?.name ?? "",
          email: data?.data?.email ?? "",
          phone: data?.data?.phone ?? "",
          associatedHospitalBranch: data.data?.associatedHospitalBranch?.userid ?? "",
        };


        setManager(mgr || null);
        const raw = data.data?.associatedHospitalBranch;
        setAssociatedBranch(
          raw && typeof raw === "object"
            ? raw
            : null
        );
      } else {
        localStorage.removeItem("token");
        navigate("/superadmin/managers");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchManagerById();
  }, [])

  const validate = (values: managerdata) => {
    const errors: Partial<Record<keyof managerdata, string>> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
    const phoneRegex = /^[1-9]\d{9}$/;

    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }

    if (values.email && !emailRegex.test(values.email)) {
      errors.email = 'Email should be valid';
    }
    if (!phoneRegex.test(values.phone)) {
      errors.phone = 'Phone number should be 10 digits';
    }
    if (!values.associatedHospitalBranch) {
      errors.associatedHospitalBranch = 'Associated branch is required';
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
        navigate("/superadmin/managers");
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


  const onSubmit = async (values: managerdata,
    actions: FormikHelpers<managerdata>) => {

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
        associatedHospitalBranch: values.associatedHospitalBranch
      }
      const response: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/edithospitalmanager/${props.managerid}`
        , {
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
        // actions.resetForm();
        toaster.create({
          title: "Hospital manager updated successfully.",
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
    <>
      {loading ? (<Center>
        <Spinner size="xl" />
      </Center>) : <Box bgColor={"white"} boxShadow={"lg"} padding={8} borderRadius={"lg"}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text
            fontWeight={"bold"}
            fontFamily="Inter, sans-serif"
            fontSize={"xl"}
            marginBottom={4}
          >
            Update Hospital Manager
          </Text>

          <Button
            size="sm"
            colorPalette="blue"
            onClick={() => { setPasswordOpen(true) }}
          >
            Reset Password
          </Button>
        </Flex>
        <Formik
          enableReinitialize
          initialValues={{
            name: manager?.name ?? "",
            email: manager?.email ?? "",
            phone: manager?.phone ?? "",
            associatedHospitalBranch: manager?.associatedHospitalBranch ?? ""
          }}
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
                    invalid={!!(touched.associatedHospitalBranch && errors.associatedHospitalBranch)}
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
                        border={touched.associatedHospitalBranch && errors.associatedHospitalBranch ? '2px solid red' : '1px solid'}
                        borderColor={touched.associatedHospitalBranch && errors.associatedHospitalBranch ? 'red' : 'gray.200'}
                        borderRadius="md"
                        bg="white"
                        wrap="wrap"
                        gap="1"
                        cursor="pointer"
                        width="100%"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        {associatedBranch ? (

                          <Text fontFamily="system-ui, sans-serif" fontSize="md" lineHeight="1.5" color="gray.800"
                            title={assciatedBrnchName}>
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
                                    setFieldValue('associatedHospitalBranch', opt.userid);
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

                    {errors.associatedHospitalBranch && (
                      <Field.ErrorText
                        fontFamily="Georgia, serif"
                        fontSize={["xs", "sm", "sm", "sm", "sm"]}
                      >
                        {errors.associatedHospitalBranch}
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
                    Update Hospital Manager
                  </Button>
                </Center>
              </Form>
          }
        </Formik>
      </Box>}
      {passwordOpen ? <ResetPassword isOpen={passwordOpen} id={props.managerid} onClose={() => { setPasswordOpen(false) }}></ResetPassword> : ''}
    </>

  )
}
