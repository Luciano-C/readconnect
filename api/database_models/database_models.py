from sqlalchemy import Column, Integer, String, Date, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()

# Association tables for many-to-many relationships
book_author_association = Table('book_author', Base.metadata,
    Column('book_id', Integer, ForeignKey('book._id')),
    Column('author_id', Integer, ForeignKey('author.id'))
)

book_category_association = Table('book_category', Base.metadata,
    Column('book_id', Integer, ForeignKey('book._id')),
    Column('category_id', Integer, ForeignKey('category.id'))
)

class Book(Base):
    __tablename__ = 'book'

    _id = Column(Integer, primary_key=True)
    title = Column(String(255), index=True)
    isbn = Column(String(255))
    pageCount = Column(Integer)
    publishedDate = Column(Date)
    thumbnailUrl = Column(String(255))
    shortDescription = Column(Text)
    longDescription = Column(Text)
    status = Column(String(100))

    # Relationships
    authors = relationship("Author", secondary=book_author_association, back_populates="books")
    categories = relationship("Category", secondary=book_category_association, back_populates="books")

    read_by_users = relationship("UserBooksRead", back_populates="book")
    to_read_by_users = relationship("UserBooksToRead", back_populates="book")
    ratings_from_users = relationship("BookRatings", back_populates="book")

class Author(Base):
    __tablename__ = 'author'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True)

    # Relationships
    books = relationship("Book", secondary=book_author_association, back_populates="authors")

class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True) 

    # Relationships
    books = relationship("Book", secondary=book_category_association, back_populates="categories")


class User(Base):
    __tablename__ = 'users'

    _id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), index=True)
    email = Column(String(100), unique=True, index=True)
    _password = Column("password", String(255))

    # You can add more attributes if needed

    def set_password(self, password):
        """Hash password and store its hashed version."""
        self._password = generate_password_hash(password)

    def check_password(self, password):
        """Check if the provided password matches the stored hashed version."""
        return check_password_hash(self._password, password)
    
    # Relationships
    read_books = relationship("UserBooksRead", back_populates="user")
    books_to_read = relationship("UserBooksToRead", back_populates="user")
    book_ratings = relationship("BookRatings", back_populates="user")


class UserBooksRead(Base):
    __tablename__ = "user_books_read"
    
    user_id = Column(Integer, ForeignKey('users._id'), primary_key=True)
    book_id = Column(Integer, ForeignKey('book._id'), primary_key=True)
    
    # Relationships
    user = relationship("User", back_populates="read_books")
    book = relationship("Book", back_populates="read_by_users")


class UserBooksToRead(Base):
    __tablename__ = "user_books_to_read"
    
    user_id = Column(Integer, ForeignKey('users._id'), primary_key=True)
    book_id = Column(Integer, ForeignKey('book._id'), primary_key=True)
    
    # Relationships
    user = relationship("User", back_populates="books_to_read")
    book = relationship("Book", back_populates="to_read_by_users")


class BookRatings(Base):
    __tablename__ = "book_ratings"
    
    user_id = Column(Integer, ForeignKey('users._id'), primary_key=True)
    book_id = Column(Integer, ForeignKey('book._id'), primary_key=True)
    rating = Column(Integer, nullable=False)
    review = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="book_ratings")
    book = relationship("Book", back_populates="ratings_from_users")
