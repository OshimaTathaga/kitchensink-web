import {useEffect, useState} from "react";

import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import {Box} from "@mui/material";
import Button from '@mui/material/Button';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowModes,
    GridToolbarContainer,
    useGridApiRef,
} from '@mui/x-data-grid';

import {api} from "../api/api.js";
import CustomAlert from "../components/CustomAlert.jsx";
import {deleteUser, updateUserRole, updateUser, createUser} from '../api/userService.js';
import AlertPopup from '../components/AlertPopup.jsx';
import {EMAIL_REGEX, PHONE_REGEX} from "../components/RegisterForm.jsx";

const containerStyle = {
    width: "70vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

const getCellClassName = (isRowInEditMode) => isRowInEditMode ? "editable-cell" : ""

const validateUser = (user) => {

    if (!user.name || user.name.length < 5) {
        return {valid: false, error: "Name cannot be empty"};
    }

    if (!user.email || !EMAIL_REGEX.test(user.email)) {
        return {valid: false, error: "Please enter a valid email address."};
    }

    if (!user.phoneNumber || !PHONE_REGEX.test(user.phoneNumber)) {
        return {valid: false, error: "Phone number must be at least 10 digits long"};
    }

    return {valid: true, error: null};
};

const getColumns = ({handleSaveClick, handleEditClick, handleDeleteClick, handleCancelClick, isRowInEditMode}) => {
    const columns = [
        {
            field: "name",
            headerName: "Name",
            width: 190,
            editable: true,
            cellClassName: ({id}) => getCellClassName(isRowInEditMode(id)),
        },
        {
            field: "email",
            headerName: "Email",
            width: 300,
            align: "left",
            headerAlign: "left",
            editable: true,
            cellClassName: ({id}) => getCellClassName(isRowInEditMode(id)),
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            width: 250,
            align: "left",
            headerAlign: "left",
            editable: true,
            cellClassName: ({id}) => getCellClassName(isRowInEditMode(id)),
        },
        {
            field: "role",
            headerName: "Role",
            width: 150,
            editable: true,
            type: "singleSelect",
            valueOptions: ["admin", "user"],
            cellClassName: ({id}) => getCellClassName(isRowInEditMode(id)),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 200,
            cellClassName: "actions",
            getActions: ({id}) => {
                const isInEditMode = isRowInEditMode(id);

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                          key={"Save"}
                          icon={<SaveIcon/>}
                          label="Save"
                          sx={{color: "primary.main"}}
                          onClick={() => handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                          key={"Cancel"}
                          icon={<CancelIcon/>}
                          label="Cancel"
                          className="textPrimary"
                          onClick={() => handleCancelClick(id)}
                          color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                      key={"Edit"}
                      icon={<EditIcon/>}
                      label="Edit"
                      className="textPrimary"
                      onClick={() => handleEditClick(id)}
                      color="inherit" />,
                    <GridActionsCellItem
                      key={"Delete"}
                      icon={<DeleteIcon/>}
                      label="Delete"
                      onClick={() => handleDeleteClick(id)}
                      color="inherit" />,
                ];
            },
        },
    ];

    return columns;
}

const AddUserToolbar = (props) => {
    const {setUsers, setRowModesModel} = props;

    const id = Math.random().toString(36).substring(2, 9);

    const handleClick = () => {
        setUsers((oldRows) => [
            ...oldRows,
            {id, name: '', email: '', phoneNumber: '', role: "user", isNew: true},
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: 'name'},
        }));
    };

    return (
      <GridToolbarContainer>
          <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
              Add User
          </Button>
      </GridToolbarContainer>
    );
}

export default function AdminView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [rowModesModel, setRowModesModel] = useState({});
    const [isOpen, setIsOpen] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState()
    const apiRef = useGridApiRef();

    const isRowInEditMode = (id) => rowModesModel[id]?.mode === GridRowModes.Edit;

    useEffect(() => {
        api.get('/api/members')
        .then(response => {
            const mappedUsers = response.data.map(member => {
                const {id, email, name, phoneNumber} = member;
                const role = member.roles[0].toLowerCase();

                return {id, email, name, phoneNumber, role};
            });

            setUsers(mappedUsers);
        })
        .catch((error) => setAlertMessage({children: error?.message || 'Some error occurred.', severity: 'error'}))
        .finally(() => setLoading(false));
    }, []);

    const findUser = (id) => users.find((user) => user.id === id);

    const handleEditClick = (id) => {
        setTimeout(() => apiRef.current.setCellFocus(id, 'name'));

        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id) => {
        const user = findUser(id)
        
        const validation = validateUser(user);
        if (!validation.valid) {
            setUsers(users.filter(row => row.id !== id));
            setAlertMessage({children: validation.error, severity: "error"});
            throw new Error(validation.error); // Prevent row update
        }

        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleAgreeDelete = async () => {
        const user = findUser(userIdToDelete);
        await deleteUser(user.email)
        setUsers(users.filter(row => row.id !== userIdToDelete));

        setAlertMessage({children: `User '${user.email}' deleted.`, severity: "success"});
    };

    const handleDeleteClick = (id) => {
        setUserIdToDelete(id);
        setIsOpen(true);
    }

    const handleCancelClick = (id) => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = users.find(row => row.id === id);
        if (editedRow.isNew) {
            setUsers(users.filter(row => row.id !== id));
        }
    };

    const createNewUser = async (newUser) => {
        await createUser(newUser)
        await updateUserRole(newUser.email, [(newUser.role).toUpperCase()])
    }

    const updateExistingUser = async (newUser) => {
        const oldUser = findUser(newUser.id);
        await updateUser(oldUser.email, newUser);
        await updateUserRole(oldUser.email, [(newUser.role).toUpperCase()]);
    }

    const processRowUpdate = async (newUser) => {
        newUser.isNew ? await createNewUser(newUser) : await updateExistingUser(newUser);

        const updatedRow = {...newUser, isNew: false};
        setUsers(users.map(row => (row.id === newUser.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop = ({id}) => {
        // Prevent row from being saved if validation fails
        const user = users.find(user => user.id === id);

        const validation = validateUser(user);

        if (!validation.valid) {
            setUsers(prevRows => prevRows.filter(row => row.id !== id)); // Remove invalid row
        }
    };

    const handleCloseCustomAlert = () => setAlertMessage(null);

    return (
      <Box sx={containerStyle}>
          <DataGrid
            apiRef={apiRef}
            sx={{width: "100%"}}
            rows={users}
            columns={getColumns({
                handleSaveClick,
                handleCancelClick,
                handleEditClick,
                handleDeleteClick,
                isRowInEditMode,
            })}
            loading={loading}
            pageSizeOptions={[5]}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
            onRowEditStop={handleRowEditStop}
            slots={{toolbar: AddUserToolbar}}
            slotProps={{toolbar: {setUsers, setRowModesModel}}} />
          <CustomAlert alertMessage={alertMessage} handleCloseCustomAlert={handleCloseCustomAlert}/>
          {isOpen && (
            <AlertPopup
              isOpen={isOpen}
              message={`Are you sure you want to delete user with email '${findUser(userIdToDelete)?.email}'?`}
              handleAgreeClick={handleAgreeDelete}
              handleClose={() => setIsOpen(false)} />
          )}
      </Box>
    );
};
