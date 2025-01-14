import axios from "axios";

export const getUser = async (email) => {
    try{
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:9000/api/members/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    }
    catch(err) {
        console.log("Error while getting user", email, err?.message)
    }
}

export const updateUser = async (email, user) => {
    try{
        const token = localStorage.getItem("token");

        const response = await axios.patch(`http://localhost:9000/api/members/${email}`, 
        {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: user.password
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    }
    catch(err) {
        console.log("Error while updating user", email, err?.message)
    }
}

export const deleteUser = async (email) => {
    try{
        const token = localStorage.getItem("token");

        await axios.delete(`http://localhost:9000/api/members/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(`User with email ${email} deleted successfully.`);
    }
    catch(err) {
        console.log("Error while deleting user", email, err?.message)
    }
}

export const updateUserRole = async (email, roles) => {
    try{
        const token = localStorage.getItem("token");

        await axios.put(`http://localhost:9000/api/members/${email}/roles`, 
        [...roles],
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(`User with email ${email} updated successfully with roles ${roles}.`);
    }
    catch(err) {
        console.log("Error while updating user roles", email, err?.message)
    }
}

export const createUser = async (user) => {
    const {name, email, phoneNumber} = user;

    try{
        const response = await axios.post(`http://localhost:9000/api/members`, 
        {
            name, email, phoneNumber, password: "password1234"
        });

        return response.data;
    }
    catch(err) {
        console.log("Error while creating user", user.email, err?.message)
    }
}

