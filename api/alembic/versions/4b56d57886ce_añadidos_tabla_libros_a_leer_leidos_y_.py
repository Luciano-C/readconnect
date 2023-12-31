"""Añadidos tabla libros a leer, leidos y calificaciones

Revision ID: 4b56d57886ce
Revises: 8271df5e3e3a
Create Date: 2023-10-21 18:57:54.779692

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4b56d57886ce'
down_revision: Union[str, None] = '8271df5e3e3a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('book_ratings',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['book_id'], ['book._id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users._id'], ),
    sa.PrimaryKeyConstraint('user_id', 'book_id')
    )
    op.create_table('user_books_read',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['book_id'], ['book._id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users._id'], ),
    sa.PrimaryKeyConstraint('user_id', 'book_id')
    )
    op.create_table('user_books_to_read',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['book_id'], ['book._id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users._id'], ),
    sa.PrimaryKeyConstraint('user_id', 'book_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_books_to_read')
    op.drop_table('user_books_read')
    op.drop_table('book_ratings')
    # ### end Alembic commands ###
