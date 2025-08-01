import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Flex,
    Center,
    Spinner
} from '@chakra-ui/react';
import { useEffect, useState } from 'react'
interface Hospital {
    name: string;
    userid: string;
    email: string;
}

interface Profile {
    userid: string;
    name: string;
    email: string;
    phone: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isLoggedIn: boolean;
}
import { useNavigate } from 'react-router-dom';
export default function MyProfile() {
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const navigate = useNavigate();
    const fetchMyProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/getmyallprofile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data: {
                success: boolean;
                profiles: Profile[];
                hospital: Hospital,
                msg?: string;
            } = await response.json();

            if (data.success === true) {
                setProfiles(data?.profiles);
                setHospital(data?.hospital);
            } else {
                localStorage.removeItem("token");
                navigate("/");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchMyProfile()
    }, [])

    return (
        <>
            {profiles.length == 0 ? <Center>
                <Spinner size="xl" />
            </Center> : <Box p={6} maxW="container.lg" mx="auto" fontFamily={"Inter, sans-serif"}>

                {/* Hospital Details Section */}
                <Box mb={8} p={6} borderWidth="1px" bg={'white'} borderRadius="lg" boxShadow="md">
                    <Heading size="lg" mb={4}>
                        Hospital Details
                    </Heading>
                    <VStack align="start" >
                        <Text><strong>Id:</strong> {hospital?.userid}</Text>
                        <Text><strong>Name:</strong> {hospital?.name}</Text>
                        <Text><strong>Email:</strong> {hospital?.email}</Text>

                    </VStack>
                </Box>

                {/* Profiles List Section */}
                <Box p={6} borderWidth="1px" bg={'gray.100'} borderRadius="lg" boxShadow="md">
                    <Heading size="lg" mb={4}>
                        Super Admin Profiles
                    </Heading>
                    <VStack
                        align="stretch"
                    >
                        {profiles.map(profile => (
                            <Flex
                                key={profile.userid}
                                align="flex-start"
                                p={4}
                                bg={profile.isLoggedIn ? 'teal.50' : 'white'}
                                borderRadius="md"
                            >
                                <Box flex="1" minW={0}>
                                    <HStack justify="space-between">
                                        <Text fontSize="lg" fontWeight="semibold" truncate>
                                            {profile.name}
                                        </Text>
                                        {profile.isLoggedIn && (
                                            <Badge colorScheme="teal">You</Badge>
                                        )}
                                    </HStack>
                                    <Text fontSize="sm" truncate>
                                        ID: {profile.userid}
                                    </Text>
                                    <Text fontSize="sm" truncate title={profile.email}>
                                        Email: {profile.email}
                                    </Text>
                                    {profile.phone && (
                                        <Text fontSize="sm" truncate>
                                            Phone: {profile.phone}
                                        </Text>
                                    )}
                                    <Text fontSize="sm" truncate>
                                        Status: {profile.isActive ? 'Active' : 'Inactive'}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500" truncate>
                                        Created: {new Date(profile.createdAt).toLocaleDateString()}
                                    </Text>
                                </Box>
                            </Flex>
                        ))}
                    </VStack>
                </Box>
            </Box>}


        </>

    )
}
