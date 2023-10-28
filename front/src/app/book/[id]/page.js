"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/app/context/authcontext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BookDetail({ params }) {

  const [bookDetails, setBookDetails] = useState(null);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const { variables } = useAuthContext();
  
  const router = useRouter(); 

 

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to save the rating and review
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/books/${params.id}/review`, { rating, review }, {
        headers: {
          'Authorization': `Bearer ${variables.token}`
        }
      });
      router.push('/profile')
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };


  const handleAddToReadList = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/books/read`, { id: params.id }, {
        headers: {
          'Authorization': `Bearer ${variables.token}`
        }
      });
      alert('Book added to read list');
    } catch (error) {
      console.error("Error adding book to read list:", error);
    }
  };

  const handleAddToToReadList = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/books/to-read`, { id: params.id }, {
        headers: {
          'Authorization': `Bearer ${variables.token}`
        }
      });
      alert('Book added to to-read list');
    } catch (error) {
      console.error("Error adding book to to-read list:", error);
    }
  };




  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/${params.id}`);
        setBookDetails(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBookDetails();
  }, [params.id]);

  if (!bookDetails) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto mt-4">
      <h2 className="text-2xl font-semibold mb-4">{bookDetails.title}</h2>
      <Image
        src={bookDetails.thumbnailUrl}
        alt={bookDetails.title}
        className="mb-4 rounded shadow"
        width={300}
        height={300}
      />
      <p className="mb-2">
        <strong>ISBN:</strong> {bookDetails.isbn}
      </p>
      <p className="mb-2">
        <strong>Pages:</strong> {bookDetails.pageCount}
      </p>
      <p className="mb-2">
        <strong>Published Date:</strong> {bookDetails.publishedDate}
      </p>
      <p className="mb-2">
        <strong>Authors:</strong>{" "}
        {bookDetails.authors.map((author) => author.name).join(", ")}
      </p>
      <p className="mb-2">
        <strong>Categories:</strong>{" "}
        {bookDetails.categories.map((category) => category.name).join(", ")}
      </p>
      <p className="mb-2">
        <strong>Description:</strong> {bookDetails.longDescription}
      </p>
      <p className="mb-2">
        <strong>Average Rating:</strong> {bookDetails.average_rating.toFixed(2)}
      </p>
      <p className="mb-4">
        <strong>Number of Reviews:</strong> {bookDetails.number_of_reviews}
      </p>
      <h3 className="text-xl font-semibold mb-3">Reviews:</h3>
      <ul className="list-decimal pl-5">
        {bookDetails.reviews.map((review) => (
          <li key={review.user_id} className="mb-2">
            <p className="font-bold">
              <strong>Rating:</strong> {review.rating}
            </p>
            <p className="italic">{review.review}</p>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-4">Submit Your Review:</h3>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating:
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rating"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="review">
            Review:
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            id="review"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Review
          </button>
        </div>
      </form>
      <div className="mt-4 mb-4">
        <button
          onClick={handleAddToReadList}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          Add to Read List
        </button>
        <button
          onClick={handleAddToToReadList}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add to To-Read List
        </button>
      </div>
    </div>

  );
}
