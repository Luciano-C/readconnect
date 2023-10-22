"use client"
import Image from 'next/image'
import axios from 'axios'
import { BookCard } from './components/bookcard';
import { useState, useEffect } from 'react';




export default function Home() {
  const [skip, setSkip] = useState(0); 
  const [books, setBooks] = useState([]); 
  const [totalCount, setTotalCount] = useState(0);

  const limit = 10;

  // Determine if there's a next page
  const hasNextPage = (skip + limit) < totalCount;

  
  
  const loadBooks = async (skip = 0) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books?skip=${skip}`);
      return {
        books: data.books,
        totalCount: data.total_count
      };
    } catch (error) {
      console.error("Failed to fetch books:", error.message);
      return {
        books: [],
        totalCount: 0
      };
    }
  }


  // Use useEffect to fetch data when `skip` changes

  useEffect(() => {
    
    const fetchBooks = async () => {
      const fetchedData = await loadBooks(skip);
      setBooks(fetchedData.books);
      setTotalCount(fetchedData.totalCount);
    };

    fetchBooks();
  }, [skip]);  

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl mb-8">Books</h1>
      <div className="flex flex-wrap">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-8 flex justify-center"> {/* Added flex and justify-center here */}
        <button 
          className={`mr-4 bg-blue-500 text-white px-4 py-2 rounded ${skip === 0 ? 'invisible': ''}`} 
          onClick={() => setSkip(prevSkip => Math.max(prevSkip - 10, 0))}  // Decrease skip by 10, but not below 0
          disabled={skip === 0}  // Disable if on first page
        >
          Previous
        </button>

        <button 
          className={`bg-blue-500 text-white px-4 py-2 rounded ${skip + 10 >= totalCount ? 'invisible': ''}`} 
          onClick={() => setSkip(prevSkip => prevSkip + 10)}  // Increase skip by 10 for next page
          disabled={!hasNextPage} // Disable if there's no next page
        >
          Next
        </button>
      </div>
    </div>
);
}

