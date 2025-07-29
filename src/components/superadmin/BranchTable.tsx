// import { useNavigate } from "react-router-dom";
// import { useEffect, useMemo, useState } from "react";
// import { LuSearch } from "react-icons/lu"
// import { FaEye } from "react-icons/fa";
// import { FaEdit } from "react-icons/fa";
// // import { FiDownload } from "react-icons/fi";
// // import { CSVLink } from "react-csv";
// import type { ColumnDef } from "@tanstack/react-table";
// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import {
//     Box,
//     Spinner,
//     InputGroup,
//     Center,
//     Input,
//     Button,
//     IconButton,
//     Text,
//     Table,
//     HStack,
//     Checkbox
// } from "@chakra-ui/react";
// import ViewBranch from "./ViewBranch";
// import AddBranch from "./AddBranch";
// import EditBranch from "./EditBranch";


// type createdBy = {
//     name: string;
//     userid: string;
// }
// export type branch = {
//     userid: string;
//     name: string;
//     email: string;
//     address: string;
//     phone: string;
//     createdAt: string;
//     isActive: boolean;
//     isdefault: boolean;
//     createdBy?: createdBy;
//     updatedAt: string;
// }
// export default function BranchTable() {
//     const navigate = useNavigate();
//     const [branches, setBranches] = useState<branch[]>([]);
//     const [searchInput, setSearchInput] = useState('')
//     const [isViewOpen, setIsViewopen] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const [editBranchId, setEditBranchId] = useState('')
//     const [viewDetails, setViewDeatils] = useState<branch | null>(null)
//     const [addOpen, setAddOpen] = useState(false)
//     const [fetchAgain, setFetchAgain] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const [rowSelection, setRowSelection] = useState({});
//     const fetchBranch = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 navigate("/");
//                 return;
//             }
//             setLoading(true);
//             const response: Response = await fetch(
//                 `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/getallbranch`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             setLoading(false);
//             const data: { success: boolean; data?: branch[]; msg?: string } = await response.json();
//             if (data.success) {
//                 setBranches(data.data || []);
//             } else {
//                 // localStorage.removeItem("token");
//                 // navigate("/");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     }



//     const data = useMemo(() => branches, [branches]);
//     const columns = useMemo<ColumnDef<branch>[]>(
//         () => [
//             {
//                 id: 'select',
//                 header: ({ table }) => {
//                     const props = {
//                         isChecked: table.getIsAllRowsSelected(),
//                         isIndeterminate: table.getIsSomeRowsSelected(),
//                         onChange: table.getToggleAllRowsSelectedHandler(),
//                     };
//                     return (
//                         <Checkbox.Root {...props}>
//                             <Checkbox.HiddenInput />
//                             <Checkbox.Control>
//                                 <Checkbox.Indicator />
//                             </Checkbox.Control>
//                             <Checkbox.Label />
//                         </Checkbox.Root>
//                     );
//                 },
//                 cell: ({ row }) => {
//                     const props = {
//                         isChecked: row.getIsSelected(),
//                         isIndeterminate: false,
//                         onChange: row.getToggleSelectedHandler(),
//                         isDisabled: !row.getCanSelect(),
//                     };
//                     return (
//                         <Checkbox.Root {...props}>
//                             <Checkbox.HiddenInput />
//                             <Checkbox.Control>
//                                 <Checkbox.Indicator />
//                             </Checkbox.Control>
//                             <Checkbox.Label />
//                         </Checkbox.Root>
//                     );
//                 },
//             },
//             { header: 'Branch Id', accessorKey: 'userid' },
//             {
//                 header: 'Name',
//                 accessorKey: 'name',
//                 cell: info => <Text title={info.getValue<string>()}>{info.getValue<string>().slice(0, 25)}{info.getValue<string>().length > 25 ? "..." : ''}</Text>,
//             },
//             {
//                 header: 'View',
//                 cell: ({ row }) => {
//                     return <IconButton
//                         aria-label="Edit"
//                         bgColor={"white"}
//                         color={"#3B82F6"}
//                         _hover={{
//                             bgColor: "white",
//                         }}
//                         onClick={() => {
//                             setIsViewopen(true)
//                             setViewDeatils(row.original)
//                         }}
//                     >
//                         <FaEye />
//                     </IconButton>
//                 },
//             },
//             {
//                 header: 'Edit',
//                 cell: ({ row }) => {
//                     return <IconButton
//                         aria-label="Edit"
//                         bgColor={"white"}
//                         color={"#3B82F6"}
//                         _hover={{
//                             bgColor: "white",
//                         }}
//                         onClick={() => {
//                             setEditOpen(true)
//                             setEditBranchId(row.original.userid)
//                         }}
//                     >
//                         <FaEdit />
//                     </IconButton>
//                 },
//             },
//             {
//                 header: "Action",
//                 cell: ({ row }) => {
//                     return row.original.isActive ?
//                         <Button
//                             colorPalette="red"
//                             size="xs"
//                         // onClick={() => handleDisable(row.original.userid)}
//                         >
//                             Disable
//                         </Button> :
//                         <Button
//                             colorPalette="green"
//                             size="xs"
//                         // onClick={() => handleEnable(row.original.userid)}
//                         >
//                             Enable
//                         </Button>
//                 },
//             },

//         ], []);

//     const [globalFilter, setGlobalFilter] = useState('');
//     const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

//     const table = useReactTable({
//         data,
//         columns,
//         enableRowSelection: true,
//         state: { globalFilter, pagination, rowSelection },
//         onGlobalFilterChange: setGlobalFilter,
//         onRowSelectionChange: setRowSelection,
//         enableMultiRowSelection: true,
//         onPaginationChange: setPagination,
//         getCoreRowModel: getCoreRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//     });

//     useEffect(() => {
//         fetchBranch()
//     }, [fetchAgain])

//     const selectedCount = table.getSelectedRowModel().rows.length;
//     return (
//         <>
//             {loading ? (
//                 <Center>
//                     <Spinner size="xl" />
//                 </Center>
//             ) : <>
//                 <Box display="flex"
//                     justifyContent="flex-end"
//                     mb={4}
//                     gap={5}>
//                     <Button
//                         colorPalette="green"
//                         borderRadius={'md'}
//                         fontFamily="Inter, sans-serif"
//                         onClick={() => {
//                             setAddOpen(true)
//                         }}
//                     >
//                         Add Branch
//                     </Button>
//                     <HStack>
//                         <Button
//                             // onClick={handleBatchEnable} 
//                             disabled={selectedCount === 0} colorScheme="green"
//                         >
//                             Enable
//                         </Button>
//                         <Button
//                             // onClick={handleSingleDisable} 
//                             disabled={selectedCount !== 1} colorScheme="red">
//                             Disable
//                         </Button>
//                     </HStack>
//                 </Box>
//                 <Box display={"flex"} flexDirection={"row-reverse"}>
//                     <InputGroup width={["100%", "80%", "50%", "30%"]} mb={1} startElement={<LuSearch />}>
//                         <Input
//                             placeholder="Search hospitals..."
//                             value={searchInput}
//                             backgroundColor={'white'}
//                             onChange={e => { setSearchInput(e.target.value); setGlobalFilter(e.target.value); }}
//                         />
//                     </InputGroup>
//                 </Box>
//                 <Box
//                     bgColor={"white"}
//                     boxShadow={"lg"}
//                     padding={8}
//                     borderRadius={"lg"}
//                 >
//                     <Table.ScrollArea maxW="100%">
//                         <Table.Root>
//                             <Table.Header>
//                                 {table.getHeaderGroups().map(headerGroup => (
//                                     <Table.Row key={headerGroup.id}>
//                                         {headerGroup.headers.map(header => (
//                                             <Table.ColumnHeader
//                                                 key={header.id}
//                                                 textAlign="center"
//                                                 {...(header.column.getToggleSortingHandler
//                                                     ? {
//                                                         onClick: header.column.getToggleSortingHandler(),
//                                                         cursor: 'pointer'
//                                                     }
//                                                     : {})}
//                                             >
//                                                 {flexRender(header.column.columnDef.header, header.getContext())}
//                                             </Table.ColumnHeader>
//                                         ))}
//                                     </Table.Row>
//                                 ))}
//                             </Table.Header>
//                             <Table.Body>
//                                 {table.getRowModel().rows.map(row => (
//                                     <Table.Row key={row.id}>
//                                         {row.getVisibleCells().map(cell => (
//                                             <Table.Cell m={1} p={0} key={cell.id} textAlign="center">
//                                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                             </Table.Cell>
//                                         ))}
//                                     </Table.Row>
//                                 ))}
//                             </Table.Body>
//                         </Table.Root>
//                     </Table.ScrollArea>
//                     <Box
//                         display="flex"
//                         mt={4}
//                         justifyContent="center"
//                         alignItems="center"
//                         gap={4}
//                         mb={[6, 4, 2, 2]}
//                     >
//                         <Button
//                             size={'xs'}
//                             onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}
//                             fontSize={"xs"}
//                             fontFamily="Times New Roman"
//                         >
//                             First
//                         </Button>
//                         <Button
//                             size={'xs'}
//                             onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
//                             fontSize={"xs"}
//                             fontFamily="Times New Roman"
//                         >
//                             Prev
//                         </Button>
//                         <Text
//                             fontSize={"xs"}
//                             fontFamily="Times New Roman"
//                         >
//                             Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//                         </Text>
//                         <Button
//                             size={'xs'}
//                             onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
//                             fontSize={"xs"}
//                             fontFamily="Times New Roman"
//                         >
//                             Next
//                         </Button>
//                         <Button
//                             size={'xs'}
//                             fontSize={"xs"}
//                             onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}
//                             fontFamily="Times New Roman"
//                         >
//                             Last
//                         </Button>
//                     </Box>
//                 </Box>
//             </>}
//             {isViewOpen ? <ViewBranch isOpen={isViewOpen} onClose={() => { setIsViewopen(false) }} data={viewDetails}></ViewBranch> : ''}
//             {addOpen ? <AddBranch isOpen={addOpen} onClose={() => { setAddOpen(false) }} setFetchAgain={setFetchAgain}></AddBranch> : ''}
//             {editOpen ? <EditBranch isOpen={editOpen} onClose={() => { setEditOpen(false) }} id={editBranchId} setBranches={setBranches}></EditBranch> : ''}
//         </>
//     )
// }

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu"
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
// import { FiDownload } from "react-icons/fi";
// import { CSVLink } from "react-csv";
import type { ColumnDef } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Box,
    Spinner,
    InputGroup,
    Center,
    Input,
    Button,
    IconButton,
    Text,
    Table,
    HStack,
    Checkbox,
    Tag
} from "@chakra-ui/react";
import ViewBranch from "./ViewBranch";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";


type createdorUpdatedBy = {
    name: string;
    userid: string;
}
export type branch = {
    userid: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    createdAt: string;
    isActive: boolean;
    isdefault: boolean;
    createdBy?: createdorUpdatedBy;
    updatedBy?: createdorUpdatedBy;
    updatedAt: string;
}
export default function BranchTable() {
    const navigate = useNavigate();
    const [branches, setBranches] = useState<branch[]>([]);
    const [searchInput, setSearchInput] = useState('')
    const [isViewOpen, setIsViewopen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editBranchId, setEditBranchId] = useState('')
    const [viewDetails, setViewDeatils] = useState<branch | null>(null)
    const [addOpen, setAddOpen] = useState(false)
    const [fetchAgain, setFetchAgain] = useState(false)
    const [loading, setLoading] = useState(true)
    const [rowSelection, setRowSelection] = useState({});
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    const fetchBranch = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/getallbranch`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: branch[]; msg?: string } = await response.json();
            if (data.success) {
                setBranches(data.data || []);
            } else {
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleToggleSelect = () => {
        setShowCheckboxes(!showCheckboxes);
        if (showCheckboxes) {
            setRowSelection({});
        }
    };

    const handleBatchEnable = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedBranchIds = selectedRows.filter(row => !row.original.isActive) // Extra safety check
            .map(row => row.original.userid);

        console.log("Enabling branches:", selectedBranchIds);
    };

    // const handleSingleDisable = () => {
    //     // Logic for disabling single selected branch
    //     const selectedRows = table.getSelectedRowModel().rows;
    //     if (selectedRows.length === 1) {
    //         const branchId = selectedRows[0].original.userid;
    //         console.log("Disabling branch:", branchId);
    //         // Add your API call here to disable single branch
    //     }
    // };

    const data = useMemo(() => branches, [branches]);
    const columns = useMemo<ColumnDef<branch>[]>(
        () => {
            const baseColumns: ColumnDef<branch>[] = [
                { header: 'Branch Id', accessorKey: 'userid' },
                {
                    header: 'Name',
                    accessorKey: 'name',
                    cell: info => <Text title={info.getValue<string>()}>{info.getValue<string>().slice(0, 25)}{info.getValue<string>().length > 25 ? "..." : ''}</Text>,
                },
                {
                    header: 'View',
                    cell: ({ row }) => {
                        return <IconButton
                            aria-label="View"
                            bgColor={"white"}
                            color={"#3B82F6"}
                            _hover={{
                                bgColor: "white",
                            }}
                            onClick={() => {
                                setIsViewopen(true)
                                setViewDeatils(row.original)
                            }}
                        >
                            <FaEye />
                        </IconButton>
                    },
                },
                {
                    header: 'Edit',
                    cell: ({ row }) => {
                        return <IconButton
                            aria-label="Edit"
                            bgColor={"white"}
                            color={"#3B82F6"}
                            _hover={{
                                bgColor: "white",
                            }}
                            onClick={() => {
                                setEditOpen(true)
                                setEditBranchId(row.original.userid)
                            }}
                        >
                            <FaEdit />
                        </IconButton>
                    },
                },
                {
                    header: "Action",
                    cell: ({ row }) => {

                        return row.original.isActive ?
                            <Button
                                colorPalette="red"
                                size="xs"
                            // onClick={() => handleDisable(row.original.userid)}
                            >
                                Disable
                            </Button>
                            : <Tag.Root size="sm" colorPalette={'red'}>
                                <Tag.Label>InActive</Tag.Label>
                            </Tag.Root>
                    },
                },
            ];

            if (showCheckboxes) {
                const checkboxColumn: ColumnDef<branch> = {
                    id: 'select',
                    header: ({ table }) => {
                        const selectableRows = table.getFilteredRowModel().rows.filter(row => !row.original.isActive);
                        const selectedSelectableRows = table.getSelectedRowModel().rows.filter(row => !row.original.isActive);
                        const isAllSelected = selectableRows.length > 0 && selectedSelectableRows.length === selectableRows.length;
                        const handleSelectAll = () => {
                            if (isAllSelected) {
                                setRowSelection({});
                            } else {
                                const newSelection: Record<string, boolean> = {};
                                selectableRows.forEach(row => {
                                    newSelection[row.id] = true;
                                });
                                setRowSelection(newSelection);
                            }
                        };

                        return (
                            <Checkbox.Root
                               checked={isAllSelected}
                                onChange={handleSelectAll}
                                disabled={selectableRows.length === 0}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                <Checkbox.Label />
                            </Checkbox.Root>
                        );
                    },
                    cell: ({ row }) => {
                        const isDisabled = row.original.isActive; 
                        return (
                            <Checkbox.Root
                                checked={row.getIsSelected()}
                                 onCheckedChange={row.getToggleSelectedHandler()}
                                disabled={isDisabled}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                <Checkbox.Label />
                            </Checkbox.Root>
                        );
                    },
                };
                return [checkboxColumn, ...baseColumns];
            }

            return baseColumns;
        }, [showCheckboxes]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

    const table = useReactTable({
        data,
        columns,
        // enableRowSelection: showCheckboxes,
        getRowId: (row) => row.userid, // Use userid as row ID for consistent selection
        state: { globalFilter, pagination, rowSelection },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableMultiRowSelection: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // Only allow selection of inactive branches
        enableRowSelection: (row) => showCheckboxes && !row.original.isActive,
    });

    useEffect(() => {
        fetchBranch()
    }, [fetchAgain])

    const selectedCount = table.getSelectedRowModel().rows.length;

    return (
        <>
            {loading ? (
                <Center>
                    <Spinner size="xl" />
                </Center>
            ) : <>
                <Box display="flex"
                    justifyContent="flex-end"
                    mb={4}
                    gap={5}>
                    <Button
                        colorPalette="blue"
                        borderRadius={'md'}

                        fontFamily="Inter, sans-serif"
                        onClick={handleToggleSelect}
                    >
                        {showCheckboxes ? 'Cancel Select' : 'Select'}
                    </Button>
                    <Button
                        colorPalette="green"
                        borderRadius={'md'}
                        fontFamily="Inter, sans-serif"
                        onClick={() => {
                            setAddOpen(true)
                        }}
                    >
                        Add Branch
                    </Button>
                    {showCheckboxes && (
                        <HStack>
                            <Button
                                onClick={handleBatchEnable}
                                disabled={selectedCount === 0}
                                colorScheme="green"
                            >
                                Enable ({selectedCount})
                            </Button>
                            {/* <Button
                                onClick={handleSingleDisable}
                                disabled={selectedCount !== 1}
                                colorScheme="red"
                            >
                                Disable
                            </Button> */}
                        </HStack>
                    )}
                </Box>
                <Box display={"flex"} flexDirection={"row-reverse"}>
                    <InputGroup width={["100%", "80%", "50%", "30%"]} mb={1} startElement={<LuSearch />}>
                        <Input
                            placeholder="Search hospitals..."
                            value={searchInput}
                            backgroundColor={'white'}
                            onChange={e => { setSearchInput(e.target.value); setGlobalFilter(e.target.value); }}
                        />
                    </InputGroup>
                </Box>
                <Box
                    bgColor={"white"}
                    boxShadow={"lg"}
                    padding={8}
                    borderRadius={"lg"}
                >
                    <Table.ScrollArea maxW="100%">
                        <Table.Root>
                            <Table.Header>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <Table.Row key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <Table.ColumnHeader
                                                key={header.id}
                                                textAlign="center"
                                                {...(header.column.getToggleSortingHandler
                                                    ? {
                                                        onClick: header.column.getToggleSortingHandler(),
                                                        cursor: 'pointer'
                                                    }
                                                    : {})}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </Table.ColumnHeader>
                                        ))}
                                    </Table.Row>
                                ))}
                            </Table.Header>
                            <Table.Body>
                                {table.getRowModel().rows.map(row => (
                                    <Table.Row key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <Table.Cell m={1} p={0} key={cell.id} textAlign="center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                    <Box
                        display="flex"
                        mt={4}
                        justifyContent="center"
                        alignItems="center"
                        gap={4}
                        mb={[6, 4, 2, 2]}
                    >
                        <Button
                            size={'xs'}
                            onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}
                            fontSize={"xs"}
                            fontFamily="Times New Roman"
                        >
                            First
                        </Button>
                        <Button
                            size={'xs'}
                            onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                            fontSize={"xs"}
                            fontFamily="Times New Roman"
                        >
                            Prev
                        </Button>
                        <Text
                            fontSize={"xs"}
                            fontFamily="Times New Roman"
                        >
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </Text>
                        <Button
                            size={'xs'}
                            onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                            fontSize={"xs"}
                            fontFamily="Times New Roman"
                        >
                            Next
                        </Button>
                        <Button
                            size={'xs'}
                            fontSize={"xs"}
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}
                            fontFamily="Times New Roman"
                        >
                            Last
                        </Button>
                    </Box>
                </Box>
            </>}
            {isViewOpen ? <ViewBranch isOpen={isViewOpen} onClose={() => { setIsViewopen(false) }} data={viewDetails}></ViewBranch> : ''}
            {addOpen ? <AddBranch isOpen={addOpen} onClose={() => { setAddOpen(false) }} setFetchAgain={setFetchAgain}></AddBranch> : ''}
            {editOpen ? <EditBranch isOpen={editOpen} onClose={() => { setEditOpen(false) }} id={editBranchId} setBranches={setBranches}></EditBranch> : ''}
        </>
    )
}