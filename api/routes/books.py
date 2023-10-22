from fastapi import HTTPException, APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config.database_connection import SessionLocal
from database_models.database_models import Book, Author, Category, UserBooksRead, User, UserBooksToRead, BookRatings
from utils.get_db import get_db
from typing import List, Optional
from models.books import *
from utils.get_current_user import get_current_user



router = APIRouter()



@router.get("/books", response_model=list[dict], tags=["Books"])
def get_all_books(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    books = db.query(Book).offset(skip).limit(limit).all()
    books_json = []
    for book in books:
        authors = [author.name for author in book.authors]
        categories = [category.name for category in book.categories]
        book_data = {
            "id": book._id,
            "title": book.title,
            "isbn": book.isbn,
            "pageCount": book.pageCount,
            "publishedDate": {"$date": book.publishedDate.isoformat()},
            "thumbnailUrl": book.thumbnailUrl,
            "shortDescription": book.shortDescription,
            "longDescription": book.longDescription,
            "status": book.status,
            "authors": authors,
            "categories": categories
        }
        books_json.append(book_data)
    return books_json


@router.get("/search-books", response_model=List[Book], tags=["Books"])
def search_books(
    category: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    min_pages: Optional[int] = Query(None),
    max_pages: Optional[int] = Query(None),
    start_date: Optional[str] = Query(None, alias="start-date"),
    end_date: Optional[str] = Query(None, alias="end-date"),
    order_by: Optional[str] = Query("title"),
    order: Optional[str] = Query("asc"),
    db: Session = Depends(get_db),
):
    books_query = db.query(Book)

    # Filtering logic:
    if category:
        books_query = books_query.join(Book.categories).filter(Category.name == category)
    if author:
        books_query = books_query.join(Book.authors).filter(Author.name == author)
    
    if min_pages and max_pages:
        books_query = books_query.filter(Book.pageCount.between(min_pages, max_pages))

    if start_date and end_date:
        start_date_dt = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_dt = datetime.strptime(end_date, '%Y-%m-%d').date()
        books_query = books_query.filter(Book.publishedDate.between(start_date_dt, end_date_dt))

    # Ordering logic:
    if order_by == "title":
        books_query = books_query.order_by(Book.title.asc() if order == "asc" else Book.title.desc())
    elif order_by == "pageCount":
        books_query = books_query.order_by(Book.pageCount.asc() if order == "asc" else Book.pageCount.desc())
    elif order_by == "publishedDate":
        books_query = books_query.order_by(Book.publishedDate.asc() if order == "asc" else Book.publishedDate.desc())

    books = books_query.all()
    return books


@router.post("/books/read", tags=["Books"])
async def add_to_read_list(book: BookID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add a book to the user's read list."""
    
    user_book = db.query(UserBooksRead).filter(UserBooksRead.user_id == current_user._id, UserBooksRead.book_id == book.id).first()
    if user_book:
        raise HTTPException(status_code=400, detail="Book already in read list")

    new_entry = UserBooksRead(user_id=current_user._id, book_id=book.book.id)
    db.add(new_entry)
    db.commit()

    return {"message": "Book added to read list"}


@router.post("/books/to-read", tags=["Books"])
async def add_to_toread_list(book: BookID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add a book to the user's to-read list."""

    user_book = db.query(UserBooksToRead).filter(UserBooksToRead.user_id == current_user._id, UserBooksToRead.book_id == book.id).first()
    if user_book:
        raise HTTPException(status_code=400, detail="Book already in to-read list")

    new_entry = UserBooksToRead(user_id=current_user._id, book_id=book.id)
    db.add(new_entry)
    db.commit()

    return {"message": "Book added to to-read list"}


@router.put("/books/move", tags=["Books"])
async def move_book_between_lists(book: BookID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Move a book from the user's to-read list to the read list and vice-versa."""
    
    # Attempt to find the book in the to-read list
    user_book_to_read = db.query(UserBooksToRead).filter(UserBooksToRead.user_id == user._id, UserBooksToRead.book_id == book.id).first()
    
    if user_book_to_read:
        # Book is in the to-read list, so move it to the read list
        db.delete(user_book_to_read)
        new_entry = UserBooksRead(user_id=user._id, book_id=book.id)
        db.add(new_entry)
        db.commit()
        return {"message": "Book moved from to-read list to read list"}
    
    # Attempt to find the book in the read list
    user_book_read = db.query(UserBooksRead).filter(UserBooksRead.user_id == user._id, UserBooksRead.book_id == book.id).first()
    
    if user_book_read:
        # Book is in the read list, so move it to the to-read list
        db.delete(user_book_read)
        new_entry = UserBooksToRead(user_id=user._id, book_id=book.id)
        db.add(new_entry)
        db.commit()
        return {"message": "Book moved from read list to to-read list"}

    # Book not found in either list
    raise HTTPException(status_code=400, detail="Book not found in either list")



@router.get("/book/{book_id}", response_model=BookResponse, tags=["Books"])
async def get_book_details(book_id: int, db: Session = Depends(get_db)):
    """Retrieve the details of a book by its ID."""
    
    # Get the book from the database
    book = db.query(Book).filter(Book._id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Convert the authors to a list of strings (or another suitable format)
    author_names = [author.name for author in book.authors]

    # Get reviews and ratings
    book_ratings = db.query(BookRatings).filter(BookRatings.book_id == book_id).all()

    # Calculate average rating
    if book_ratings:
        avg_rating = sum([br.rating for br in book_ratings]) / len(book_ratings)
    else:
        avg_rating = 0

    # Construct reviews list
    reviews = [{"user_id": br.user_id, "rating": br.rating, "review": br.review} for br in book_ratings]

    return {
        "id": book._id,
        "title": book.title,
        "isbn": book.isbn,
        "pageCount": book.pageCount,
        "publishedDate": book.publishedDate,
        "thumbnailUrl": book.thumbnailUrl,
        "shortDescription": book.shortDescription,
        "longDescription": book.longDescription,
        "status": book.status,
        "authors": author_names,  
        "categories": [category.name for category in book.categories],  # Similar adjustment for categories
        "average_rating": avg_rating,
        "number_of_reviews": len(book_ratings),
        "reviews": reviews
    }



@router.get("/user/books/read", response_model=List[Book], tags=["Books"])
async def get_user_read_books(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve the list of books that the user has read."""
    
    # Get the list of books from the database
    read_books = db.query(Book).join(UserBooksRead, UserBooksRead.book_id == Book._id).filter(UserBooksRead.user_id == current_user._id).all()

    return read_books


@router.get("/user/books/to-read", response_model=List[Book], tags=["Books"])
async def get_user_to_read_books(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve the list of books that the user plans to read."""
    
    # Get the list of books from the database
    to_read_books = db.query(Book).join(UserBooksToRead, UserBooksToRead.book_id == Book._id).filter(UserBooksToRead.user_id == current_user._id).all()

    return to_read_books



@router.post("/books/{book_id}/review", tags=["Books"])
async def add_or_update_review(book_id: int, rating_review: BookReviewAndRating, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add or update a user's review and rating for a book."""
    
    # Check if the user has already reviewed this book
    existing_review = db.query(BookRatings).filter(BookRatings.user_id == current_user._id, BookRatings.book_id == book_id).first()
    
    if existing_review:
        # Update the existing review and rating
        existing_review.rating = rating_review.rating
        existing_review.review = rating_review.review
    else:
        # Add a new review and rating
        new_review = BookRatings(user_id=current_user._id, book_id=book_id, rating=rating_review.rating, review=rating_review.review)
        db.add(new_review)
    
    db.commit()
    
    return {"message": "Review and rating added/updated successfully"}

