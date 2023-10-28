"use client"
import UpdateUsernameForm from "../components/usernameform"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../context/authcontext";
import BookListItem from "../components/booklistitem";

export default function MyProfile() {
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [user, setUser] = useState({})
    const [readBooks, setReadBooks] = useState([]);
    const [toReadBooks, setToReadBooks] = useState([]);
    const { variables } = useAuthContext();



    const getUser = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${variables.token}`
                }
            });
            console.log(data);
            setUser(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [variables.token]);



    const getReadBooks = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/books/read`, {
                headers: {
                    'Authorization': `Bearer ${variables.token}`
                }
            });
            setReadBooks(data);
        } catch (error) {
            console.error("Error fetching read books:", error);
        }
    }, [variables.token]);

    const getToReadBooks = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/books/to-read`, {
                headers: {
                    'Authorization': `Bearer ${variables.token}`
                }
            });
            setToReadBooks(data);
        } catch (error) {
            console.error("Error fetching to-read books:", error);
        }
    }, [variables.token]);

    const moveBook = (bookId, fromListType) => {
        if (fromListType === "read") {
            const bookToMove = readBooks.find(book => book.id === bookId);
            setReadBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            setToReadBooks(prevBooks => [bookToMove, ...prevBooks]);
        } else {
            const bookToMove = toReadBooks.find(book => book.id === bookId);
            setToReadBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            setReadBooks(prevBooks => [bookToMove, ...prevBooks]);
        }
    };



    useEffect(() => {
        getUser();
        getReadBooks();
        getToReadBooks();
    }, [getUser, getReadBooks, getToReadBooks]);


    return (
        <div className="bg-white p-2 rounded-md shadow-md w-96 mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>

            <div className="mb-4">
                <p><span className="font-semibold">Username:</span> {user?.username}</p>
                <p className="mt-2"><span className="font-semibold">Email:</span> {user?.email}</p>
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full"
                onClick={() => setShowUpdateForm(!showUpdateForm)}>
                {showUpdateForm ? "Hide Change Username Form" : "Show Change Username Form"}
            </button>

            {showUpdateForm && <UpdateUsernameForm refreshUserProfile={getUser} />}

            {/* Display the books user has read */}
            <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Books I have Read</h3>
                <ul>
                    {readBooks.map(book => (
                        <BookListItem key={book.id} book={book} listType="read" onUpdate={getReadBooks} onMove={moveBook} />
                    ))}
                </ul>
            </div>

            {/* Display the books user plans to read */}
            <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Books I Plan to Read</h3>
                <ul>
                    {toReadBooks.map(book => (
                        <BookListItem key={book.id} book={book} listType="toRead" onUpdate={getToReadBooks} onMove={moveBook} />
                    ))}
                </ul>
            </div>

        </div>
    );
}

