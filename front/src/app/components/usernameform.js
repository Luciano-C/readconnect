"use client"
import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/authcontext';

function UpdateUsernameForm({refreshUserProfile}) {
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');
    const { variables } = useAuthContext()

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-username`, { new_username: newUsername }, {
                headers: {
                    'Authorization': `Bearer ${variables.token}`
                }
            });
            refreshUserProfile();
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                setMessage(error.response.data.detail);
            } else {
                setMessage('Error updating username');
            }
        }
    }

    return (
        <div className="bg-white p-6 rounded-md shadow-md w-96 mx-auto mt-10">
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">New Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>
                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full">Update Username</button>
                </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default UpdateUsernameForm;
