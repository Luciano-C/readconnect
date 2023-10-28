"use client"
import axios from 'axios';
import Link from 'next/link';
import { useAuthContext } from '../context/authcontext';

function BookListItem({ book, listType, onUpdate, onMove }) {
    
    const {variables} = useAuthContext();
    const handleMoveClick = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/books/move`, { id: book.id }, {
                headers: {
                    'Authorization': `Bearer ${variables.token}`
                }
            });
            onMove(book.id, listType);
            onUpdate(); // refresh the book lists
        } catch (error) {
            console.error("Error moving book:", error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/books/delete/${book.id}`, {
                headers: {
                    'Authorization': `Bearer ${variables.token}`
                }
            });
            onUpdate(); // refresh the book lists
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    

    return (
        <li key={book.id} className="mb-4 p-4 border rounded-lg">
            <Link href={`/book/${book.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                    {book.title}
            </Link>
            <div className="mt-2 space-x-2">
                <button onClick={handleMoveClick} className="bg-blue-500 text-white w-40 px-3 py-1 rounded-md hover:bg-blue-600">
                    {listType === 'read' ? 'Mark as To-Read' : 'Mark as Read'}
                </button>
                <button onClick={handleDeleteClick} className="bg-red-500 text-white w-40 px-3 py-1 rounded-md hover:bg-red-600">
                    Delete
                </button>
            </div>
        </li>
    );
}

export default BookListItem;
