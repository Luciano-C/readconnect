from pydantic import BaseModel
from datetime import datetime
from typing import List

class AuthorBase(BaseModel):
    name: str

class CategoryBase(BaseModel):
    name: str

class Book(BaseModel):
    id: int  
    title: str
    isbn: str
    pageCount: int
    publishedDate: datetime
    thumbnailUrl: str
    shortDescription: str
    longDescription: str
    status: str
    authors: List[AuthorBase]
    categories: List[CategoryBase]
    

    class Config:
        from_attributes = True


class BookID(BaseModel):
    id: int


class BookReview(BaseModel):
    user_id: int
    rating: float
    review: str

class BookResponse(Book):
    average_rating: float
    number_of_reviews: int
    reviews: List[BookReview]

class BookReviewAndRating(BaseModel):
    rating: int
    review: str