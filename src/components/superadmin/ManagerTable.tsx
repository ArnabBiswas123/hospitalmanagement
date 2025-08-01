import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu"
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
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
import { toaster } from "../ui/toaster";
import ViewManager from "./ViewManager";



type createdorUpdatedBy = {
    name: string;
    userid: string;
}

export type manager = {
    userid: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    associatedHospitalBranch: createdorUpdatedBy
    isActive: boolean;
    isdefault: boolean;
    createdBy?: createdorUpdatedBy;
    updatedBy?: createdorUpdatedBy;
    updatedAt: string;
}
export default function BranchTable() {
    const navigate = useNavigate();
    const [managers, setManagers] = useState<manager[]>([]);
    const [searchInput, setSearchInput] = useState('')
    const [isViewOpen, setIsViewopen] = useState(false);
    const [viewDetails, setViewDeatils] = useState<manager | null>(null)
    const [loading, setLoading] = useState(true)
    const [rowSelection, setRowSelection] = useState({});
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    const fetchManager = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/getallhospitalmanagers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: manager[]; msg?: string } = await response.json();
            if (data.success) {
                setManagers(data.data || []);
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

    const handleBatchEnable = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        const confirmEnable = window.confirm(
            "Are you sure you want to enable selected Hospital Branches?"
        );
        if (!confirmEnable) return;
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedManagerIds = selectedRows
            .filter(row => !row.original.isActive)
            .map(row => row.original.userid);

        if (selectedManagerIds.length === 0) {
            toaster.create({
                title: "No inactive branches selected.",
                type: "info",
                duration: 2500,
            });
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/enablemanagers`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ managerIds: selectedManagerIds }),
                }
            );

            const data = await response.json();
            if (data.success) {
                setManagers(prevData =>
                    prevData.map(item =>
                        data.enabledUserIds.includes(item.userid)
                            ? { ...item, isActive: true }
                            : item
                    )
                );

                let title = `${data.enabledCount} manager${data.enabledCount! > 1 ? "s" : ""} enabled successfully`;
                if (data.skippedCount! > 0) {
                    title += `; ${data.skippedCount} manager${data.skippedCount! > 1 ? "s" : ""} skipped (branch disabled)`;
                }
                toaster.create({
                    title: title,
                    type: "success",
                    duration: 2500,
                });
                setRowSelection({})
                setShowCheckboxes(false)
            } else {
                toaster.create({
                    title: data.msg || "Failed to enable branches.",
                    type: "error",
                    duration: 2500,
                });
            }
        } catch (error) {
            console.error(error);

        }
    };

    const handleDisable = async (rowId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
        const confirmDelete = window.confirm(
            "Are you sure you want to disable this Hospital Branch?"
        );
        if (!confirmDelete) {
            return;
        }
        try {
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/hospitalsuperadmin/disablemanager/${rowId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data: { success: boolean; msg?: string } = await response.json();
            if (data.success === true) {
                setManagers((prevData) =>
                    prevData.map((item) =>
                        item.userid === rowId ? { ...item, isActive: false } : item
                    ))
                toaster.create({
                    title: "Manager disabled successfully!",
                    type: "success",
                    duration: 2500,
                });

            }
        } catch (error) {
            console.log(error);
        }
    }
    const data = useMemo(() => managers, [managers]);
    const columns = useMemo<ColumnDef<manager>[]>(
        () => {
            const baseColumns: ColumnDef<manager>[] = [
                { header: 'Manager Id', accessorKey: 'userid' },
                {
                    header: 'Branch Id', accessorKey: 'branchid',
                    cell: ({ row }) => {
                        return <Text title={row.original.associatedHospitalBranch.name}>
                            {row.original.associatedHospitalBranch.userid}
                        </Text>
                    }
                },
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
                    cell: ({row}) => {
                        return <IconButton
                            aria-label="Edit"
                            bgColor={"white"}
                            color={"#3B82F6"}
                            _hover={{
                                bgColor: "white",
                            }}
                            onClick={() => {
                                navigate(`/superadmin/editmanager/${row.original.userid}`)
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
                                onClick={() => handleDisable(row.original.userid)}
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
                const checkboxColumn: ColumnDef<manager> = {
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
                                colorPalette={'blue'}
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
                                colorPalette={'blue'}
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
        getRowId: (row) => row.userid,
        state: { globalFilter, pagination, rowSelection },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableMultiRowSelection: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: (row) => showCheckboxes && !row.original.isActive,
    });

    useEffect(() => {
        fetchManager()
    }, [])

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
                    {showCheckboxes && (
                        <HStack>
                            <Button
                                onClick={handleBatchEnable}
                                disabled={selectedCount === 0}
                                colorPalette="green"
                            >
                                Enable ({selectedCount})
                            </Button>
                        </HStack>
                    )}
                    <Button
                        colorPalette="green"
                        borderRadius={'md'}
                        fontFamily="Inter, sans-serif"
                        onClick={() => {
                            navigate('/superadmin/addmanager')
                        }}
                    >
                        Add Manager
                    </Button>
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
            {isViewOpen ? <ViewManager isOpen={isViewOpen} onClose={() => { setIsViewopen(false) }} data={viewDetails}></ViewManager> : ''}
        </>
    )
}