import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Typography } from "@mui/material";
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

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const getColumns = ({handleSaveClick, handleEditClick, handleDeleteClick, handleCancelClick, rowModesModel}) => {
    const columns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        {
          field: 'email',
          headerName: 'Email',
          width: 200,
          align: 'left',
          headerAlign: 'left',
          editable: false,
        },
        {
          field: 'phoneNumber',
          headerName: 'Phone Number',
          width: 120,
          align: 'left',
          headerAlign: 'left',
          editable: true,
        },
        {
          field: 'role',
          headerName: 'Role',
          width: 100,
          editable: true,
          type: 'singleSelect',
          valueOptions: ['admin', 'user'],
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 100,
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
    const { setRows, setRowModesModel } = props;
  
    const id = Math.random().toString(36).substring(2, 9);

    const handleClick = () => {
      setRows((oldRows) => [
        ...oldRows,
        { id, name: '', email: '', phoneNumber: '', role: '' },
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
    const [rows, setRows] = useState(users);

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
  
    const handleEditClick = (id) => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
  
    const handleSaveClick = (id) => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
  
    const handleDeleteClick = (id) => {
      setRows(rows.filter((row) => row.id !== id));
    };
  
    const handleCancelClick = (id) => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    };
  
    const processRowUpdate = (newRow) => {
      setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
      return newRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const handleCloseCustomAlert = () => setAlertMessage(null);   

    return <Box sx={containerStyle}>
        <Typography variant="h1">Welcome Admin!</Typography>

        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
            rows={users}
            columns={getColumns({handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick, rowModesModel})}
            loading={loading}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            pageSizeOptions={[5]}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: AddUserToolbar }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            />
        </Box>
        <CustomAlert alertMessage={alertMessage} handleCloseCustomAlert={handleCloseCustomAlert}/>
    </Box>;
};
