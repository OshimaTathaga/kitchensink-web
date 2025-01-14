import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowModes,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import CustomAlert from "../components/CustomAlert.jsx";
import { deleteUser, updateUserRole, updateUser, createUser } from '../api/userService.js';
import AlertPopup from '../components/AlertPopup.jsx';

const containerStyle = {
  width: "70vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const getColumns = ({handleSaveClick, handleEditClick, handleDeleteClick, handleCancelClick, rowModesModel}) => {
    const columns = [
        { field: 'name', headerName: 'Name', width: 190, editable: true },
        {
          field: 'email',
          headerName: 'Email',
          width: 300,
          align: 'left',
          headerAlign: 'left',
          editable: true,
        },
        {
          field: 'phoneNumber',
          headerName: 'Phone Number',
          width: 250,
          align: 'left',
          headerAlign: 'left',
          editable: true,
        },
        {
          field: 'role',
          headerName: 'Role',
          width: 150,
          editable: true,
          type: 'singleSelect',
          valueOptions: ['admin', 'user'],
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 200,
          cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  key={"Save"}
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={() => handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  key={"Cancel"}
                  icon={<CancelIcon />}
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
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                key={"Delete"}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        },
      ]; 

      return columns;
}

const AddUserToolbar = (props) => {
    const { setUsers, setRowModesModel } = props;
  
    const id = Math.random().toString(36).substring(2, 9);

    const handleClick = () => {
      setUsers((oldRows) => [
        ...oldRows,
        { id, name: '', email: '', phoneNumber: '', role: "user", isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
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

    useEffect(() => {
        api.get('/api/members')
        .then((response) => {
            const mappedUsers = response.data.map((member) => {
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
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
  
    const handleSaveClick = (id) => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
  
    const handleAgreeDelete = async () => {
      const user = findUser(userIdToDelete);
      await deleteUser(user.email)
      setUsers(users.filter((row) => row.id !== userIdToDelete));
    };

    const handleDeleteClick = (id) => {
      setUserIdToDelete(id);
      setIsOpen(true);
    }
  
    const handleCancelClick = (id) => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = users.find((row) => row.id === id);
      if (editedRow.isNew) {
        setUsers(users.filter((row) => row.id !== id));
      }
    };

    const createNewUser = async (newUser) => {
      await createUser(newUser)
      await updateUserRole(newUser.email, [(newUser.role).toUpperCase()])
    }

    const updateExistingUser = async (newUser) => {
      const oldUser = findUser(newUser.id);
      await updateUser(oldUser.email, newUser);
      await updateUserRole(oldUser.email, [(newUser.role).toUpperCase()])
    }
  
    const processRowUpdate = async (newUser) => {
      newUser.isNew ? createNewUser(newUser) : updateExistingUser(newUser);

      const updatedRow = { ...newUser, isNew: false };
      setUsers(users.map((row) => (row.id === newUser.id ? updatedRow : row)));
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const handleCloseCustomAlert = () => setAlertMessage(null);   

    return (
      <Box sx={containerStyle}>
        <DataGrid
          sx={{ width: "100%" }}
          rows={users}
          columns={getColumns({
            handleSaveClick,
            handleCancelClick,
            handleEditClick,
            handleDeleteClick,
            rowModesModel,
          })}
          loading={loading}
          pageSizeOptions={[5]}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: AddUserToolbar }}
          slotProps={{
            toolbar: { setUsers, setRowModesModel },
          }}
        />
        <CustomAlert alertMessage={alertMessage} handleCloseCustomAlert={handleCloseCustomAlert}/>
        {isOpen && (
          <AlertPopup
            isOpen={isOpen}
            message={`Are you sure you want to delete user with email ${findUser(userIdToDelete)?.email}?`}
            handleAgreeClick={handleAgreeDelete}
            handleClose={() => setIsOpen(false)}
          />
        )}
      </Box>
    );
};
