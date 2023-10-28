import json
from config.database_connection import SessionLocal
from database_models.database_models import *
from datetime import datetime
import uuid

def parse_datetime(date_str):
    return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%f%z')


def get_published_date(book_data):
    """Extract and parse the publishedDate from the book data."""
    published_date_data = book_data.get("publishedDate")
    if not published_date_data:
        print("No published date found. Using a default value...")
        return None  

    date_str = published_date_data.get("$date")
    if not date_str:
        print("No $date key in publishedDate. Using a default value...")
        return None  

    return parse_datetime(date_str)


with open('amazon.books.json', 'r') as f:
    all_books_data = json.load(f)
    books_data = all_books_data[:300]

session = SessionLocal()

for book_data in books_data:
    isbn = book_data.get("isbn")
    if isbn:
        existing_book = session.query(Book).filter_by(isbn=isbn).first()
        if existing_book:
            print(f"Book with ISBN {isbn} already exists. Skipping...")
            continue
    else:
        print("Book with no ISBN found. Assigning a unique identifier...")
        isbn = f"NOISBN-{uuid.uuid4()}"

   
    
    author_objects = []
    for author_name in author_objects:
        author = session.query(Author).filter_by(name=author_name).first()
        if not author:
            print(f"Author {author_name} not found. Adding to the database...")
            author = Author(name=author_name)
            session.add(author)
        else:
            print(f"Author {author_name} already exists. Skipping...")
            continue
        author_objects.append(author)
    
    # Handle Categories
    category_objects = []
    for category_name in category_objects:
        category = session.query(Category).filter_by(name=category_name).first()
        if not category:
            print(f"Category {category_name} not found. Adding to the database...")
            category = Category(name=category_name)
            session.add(category)
            category_objects.append(category)
        else:
            print(f"Category {category_name} already exists. Skipping...")

    # Create Book instance
    book = Book(
        title=book_data["title"],
        isbn=isbn,
        pageCount=book_data["pageCount"],
        publishedDate=get_published_date(book_data),
        thumbnailUrl=book_data.get("thumbnailUrl", ""),
        shortDescription=book_data.get("shortDescription", ""),
        longDescription=book_data.get("longDescription", ""),
        status=book_data["status"],
        authors=list(set(author_objects)), 
        categories=list(set(category_objects)) 
    )

    # Add the book to the session
    session.add(book)

# Commit the session to save changes
try:
    session.commit()
except Exception as e:
    print(f"An error occurred: {e}")
    session.rollback()
finally:
    session.close()
