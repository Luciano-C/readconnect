"use client"
import Image from 'next/image'
import axios from 'axios'
import { BookCard } from './components/bookcard';
import { useState, useEffect } from 'react';
import { FilterForm } from './components/filterForm';

export default function Home() {
  const [skip, setSkip] = useState(0);
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);


  const limit = 10;

  const hasNextPage = (skip + limit) < totalCount;

  const base_url = process.env.NEXT_PUBLIC_API_URL;

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

  const searchBooks = async (filters = {}) => {
    const params = {
      category: filters.category,
      author: filters.author,
      min_pages: filters.minPages,
      max_pages: filters.maxPages,
      start_date: filters.startDate,
      end_date: filters.endDate,
      order_by: filters.order_by,  // default ordering by title
      order: filters.order
    };


    const url = new URL("/search-books", base_url);
    Object.keys(params).forEach(key => {
      if (params[key] !== "") {
        url.searchParams.append(key, params[key]);
      }
    });


    try {
      const { data } = await axios.get(url);
      return {
        books: data,
        totalCount: data.length  
      };
    } catch (error) {
      console.error("Failed to search books:", error.message);
      return {
        books: [],
        totalCount: 0
      };
    }
  }



  const handleFilterSubmit = async (filterValues) => {
    console.log("Filters submitted:", filterValues); // Log to check the values

    const searchedData = await searchBooks(filterValues);
    setBooks(searchedData.books);
    setTotalCount(searchedData.totalCount);

    setSkip(0);  // Reset to the first page after applying filters
    setFiltersApplied(true); // Indicate filters have been applied
  }

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
      <div className="flex justify-center mb-4">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50" onClick={() => setShowFilters(prev => !prev)}>
          Toggle Filters
        </button>
      </div>

      {showFilters && <FilterForm handleFilterSubmit={handleFilterSubmit} />}

      <div className="flex flex-wrap mt-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {!filtersApplied && (
          <>
            <button
              className={`mr-4 bg-blue-500 text-white px-4 py-2 rounded ${skip === 0 ? 'invisible' : ''}`}
              onClick={() => setSkip(prevSkip => Math.max(prevSkip - 10, 0))}
              disabled={skip === 0}
            >
              Previous
            </button>

            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded ${skip + 10 >= totalCount ? 'invisible' : ''}`}
              onClick={() => setSkip(prevSkip => prevSkip + 10)}
              disabled={!hasNextPage}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}


