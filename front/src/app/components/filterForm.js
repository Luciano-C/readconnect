"use client"
import { useState } from "react"

export const FilterForm = ({ handleFilterSubmit }) => {

    const defaultFilters = {
        category: "",
        author: "",
        minPages: "",
        maxPages: "",
        startDate: "",
        endDate: "",
        order_by: "title",  // default ordering by title
        order: "asc"       // default ordering as ascending
    };

    const [filters, setFilters] = useState(defaultFilters);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();  // Prevent the default behavior of form submission
        handleFilterSubmit(filters);
    }

    const clearFilters = () => {
        setFilters(defaultFilters);
        window.location.reload();
    };

    return (
        <form className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl m-auto" onSubmit={handleSubmit}>

            <input className="w-full p-2 border rounded" name="category" type="text" placeholder="Category" value={filters.category} onChange={handleInputChange} />

            <input className="w-full p-2 border rounded" name="author" type="text" placeholder="Author" value={filters.author} onChange={handleInputChange} />

            <div className="flex space-x-4">
                <input className="w-1/2 p-2 border rounded" name="minPages" type="number" placeholder="Min Pages" value={filters.minPages} onChange={handleInputChange} />

                <input className="w-1/2 p-2 border rounded" name="maxPages" type="number" placeholder="Max Pages" value={filters.maxPages} onChange={handleInputChange} />
            </div>

            <div className="flex space-x-4">
                <input className="w-1/2 p-2 border rounded" name="startDate" type="date" value={filters.startDate} onChange={handleInputChange} />

                <input className="w-1/2 p-2 border rounded" name="endDate" type="date" value={filters.endDate} onChange={handleInputChange} />
            </div>

            <div className="flex space-x-4">
                <select className="w-1/2 p-2 border rounded" name="order_by" value={filters.order_by} onChange={handleInputChange}>
                    <option value="title">Title</option>
                    <option value="pageCount">Page Count</option>
                    <option value="publishedDate">Published Date</option>
                </select>

                <select className="w-1/2 p-2 border rounded" name="order" value={filters.order} onChange={handleInputChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            <div className="flex space-x-4">
                <button className="w-1/2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Search</button>
                <button className="w-1/2 p-2 bg-gray-400 text-white rounded hover:bg-gray-500" type="button" onClick={clearFilters}>Clear Filters</button>
            </div>
        </form>
    );
}