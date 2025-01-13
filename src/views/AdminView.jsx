import {Box, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";

import {api} from "../api/api.js";
import CustomAlert from "../components/CustomAlert.jsx";

export default function AdminView() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleCloseCustomAlert = () => setAlertMessage(null);

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            sortable: true,
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            sortable: true,
            editable: true,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            type: 'number',
            width: 250,
            sortable: true,
            editable: true,
        },
        {
            field: 'role',
            headerName: 'Role',
            type: 'number',
            width: 110,
            sortable: true,
            editable: false,
        }
    ];

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

    return <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h1">Welcome admin.</Typography>
        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
              rows={users}
              columns={columns}
              loading={loading}
              initialState={{
                  pagination: {
                      paginationModel: {
                          pageSize: 5,
                      },
                  },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
        </Box>
        <CustomAlert alertMessage={alertMessage} handleCloseCustomAlert={handleCloseCustomAlert}/>
    </Box>;
};
