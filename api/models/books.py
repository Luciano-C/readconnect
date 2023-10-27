from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

class AuthorBase(BaseModel):
    name: str

class CategoryBase(BaseModel):
    name: str



class BookOut(BaseModel):
    _id: int  
    title: str
    isbn: str
    pageCount: int
    publishedDate: Optional[str]  # Change this to a direct date type
    thumbnailUrl: str
    shortDescription: str
    longDescription: str
    status: str
    authors: List[AuthorBase]
    categories: List[CategoryBase]

    


class BookID(BaseModel):
    id: int


class BookReview(BaseModel):
    user_id: int
    rating: float
    review: str

class BookResponse(BookOut):
    average_rating: float
    number_of_reviews: int
    reviews: List[BookReview]

class BookReviewAndRating(BaseModel):
    rating: int
    review: str