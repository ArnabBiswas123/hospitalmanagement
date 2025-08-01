
import { Box, CloseButton, Center, Text, Dialog, Portal } from "@chakra-ui/react"
import type { manager } from "./ManagerTable";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    data: manager | null
}

export default function ViewManager(props: Proptype) {
    const userName = props.data?.createdBy?.name ?? "";
    const updateduserName = props.data?.updatedBy?.name ?? "";
    const branchName = props.data?.associatedHospitalBranch?.name ?? ""
    const displayName =
        userName.length > 45
            ? `${userName.slice(0, 45)}…`
            : userName;
    const displayBranch = branchName.length > 30 ? `${branchName.slice(0, 30)}…`
        : branchName;
    const displayUpdated = updateduserName.length > 45
        ? `${updateduserName.slice(0, 45)}…`
        : updateduserName;



    return (
        <Dialog.Root size={'sm'}
            onOpenChange={() => props.onClose()}
            open={props.isOpen}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Details of the Hospital Manager</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            {props.data ? (
                                <Box display={'flex'} flexDir={'column'} gap={2}>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Id:</strong><Text title={props.data?.userid}>{props.data?.userid}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Name:</strong><Text title={props.data?.name}>{props.data?.name.slice(0, 45)}{props.data?.name.length > 45 ? "..." : ''}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Email:</strong> <Text title={props.data?.email}>{props.data?.email.slice(0, 45)}{props.data?.email.length > 45 ? "..." : ''}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Phone:</strong> <Text title={props.data?.phone}>{props.data?.phone}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Associated Hospital:</strong><Text title={props.data?.associatedHospitalBranch.name}>{`${displayBranch} , ${props.data?.associatedHospitalBranch.userid}`}</Text>
                                    </Box>
                                    {props.data?.isdefault ? <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>CreatedBy:</strong> <Text>Super Super Admin</Text>
                                    </Box> : <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>CreatedBy:</strong> <Text title={props.data?.createdBy?.name}>{`${displayName} , ${props.data?.createdBy?.userid}`}</Text>
                                    </Box>}

                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Created At:</strong> <Text title={props.data?.createdAt}> {props.data?.createdAt && new Date(props.data.createdAt).toLocaleString('en-IN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}</Text>
                                    </Box>
                                    {props.data?.updatedBy ? <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>UpdatedBy:</strong> <Text title={props.data?.updatedBy?.name}>{`${displayUpdated} , ${props.data?.updatedBy?.userid}`}</Text>
                                    </Box> : ''}
                                    {props.data?.createdAt != props.data?.updatedAt ? <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Updated At:</strong> <Text title={props.data?.updatedAt}> {props.data?.updatedAt && new Date(props.data.updatedAt).toLocaleString('en-IN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}</Text>
                                    </Box> : ''}


                                </Box>
                            ) : (
                                <Box>No data selected</Box>
                            )}
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
