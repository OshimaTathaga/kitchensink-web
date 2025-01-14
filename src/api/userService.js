import axios from "axios";

export const getUser = async (email) => {
    try{
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:9000/api/members/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        return response.data;
    }
    catch(err) {
        console.log("Error while creating user", email, err?.message)
    }
}

export const updateUser = async (email, data) => {
    try{
        const token = localStorage.getItem("token");

        const response = await axios.patch(`http://localhost:9000/api/members/${email}`, 
        {
            name: data.name,
            phoneNumber: data.phoneNumber,
            password: data.password
        },
        {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        console.log(`User with email ${email} deleted successfully.`);
    }
    catch(err) {
        console.log("Error while deleting user", email, err?.message)
    }
}