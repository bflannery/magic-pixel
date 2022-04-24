"""adds vistor person alias pivots

Revision ID: 061b45bf96c7
Revises: a016a16f2341
Create Date: 2022-01-13 07:30:22.579422

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '061b45bf96c7'
down_revision = 'a016a16f2341'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('person_alias',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text("(now() at time zone 'utc')"), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text("(now() at time zone 'utc')"), nullable=True),
    sa.Column('account_site_id', sa.BigInteger(), nullable=True),
    sa.Column('alias_id', sa.BigInteger(), nullable=True),
    sa.Column('person_id', sa.BigInteger(), nullable=True),
    sa.Column('confidence', sa.DECIMAL(precision=5, scale=2), nullable=False, default=0.00),
    sa.ForeignKeyConstraint(['account_site_id'], ['account_site.id'], ),
    sa.ForeignKeyConstraint(['alias_id'], ['alias.id'], ),
    sa.ForeignKeyConstraint(['person_id'], ['person.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_person_alias_account_site_id'), 'person_alias', ['account_site_id'], unique=False)
    op.create_index(op.f('ix_person_alias_alias_id'), 'person_alias', ['alias_id'], unique=False)
    op.create_index(op.f('ix_person_alias_person_id'), 'person_alias', ['person_id'], unique=False)
    op.create_index(op.f('ix_person_alias_confidence'), 'person_alias', ['confidence'], unique=False)

    op.create_table('visitor_person',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text("(now() at time zone 'utc')"), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text("(now() at time zone 'utc')"), nullable=True),
    sa.Column('account_site_id', sa.BigInteger(), nullable=True),
    sa.Column('visitor_id', sa.BigInteger(), nullable=True),
    sa.Column('person_id', sa.BigInteger(), nullable=True),
    sa.Column('confidence', sa.DECIMAL(precision=5, scale=2), nullable=False, default=0.00),
    sa.ForeignKeyConstraint(['account_site_id'], ['account_site.id'], ),
    sa.ForeignKeyConstraint(['person_id'], ['person.id'], ),
    sa.ForeignKeyConstraint(['visitor_id'], ['visitor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_visitor_person_account_site_id'), 'visitor_person', ['account_site_id'], unique=False)
    op.create_index(op.f('ix_visitor_person_person_id'), 'visitor_person', ['person_id'], unique=False)
    op.create_index(op.f('ix_visitor_person_visitor_id'), 'visitor_person', ['visitor_id'], unique=False)
    op.create_index(op.f('ix_visitor_person_confidence'), 'visitor_person', ['confidence'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_visitor_person_confidence'), table_name='visitor_person')
    op.drop_index(op.f('ix_visitor_person_visitor_id'), table_name='visitor_person')
    op.drop_index(op.f('ix_visitor_person_person_id'), table_name='visitor_person')
    op.drop_index(op.f('ix_visitor_person_account_site_id'), table_name='visitor_person')
    op.drop_table('visitor_person')

    # op.drop_index(op.f('ix_person_alias_confidence'), table_name='person_alias')
    op.drop_index(op.f('ix_person_alias_person_id'), table_name='person_alias')
    op.drop_index(op.f('ix_person_alias_alias_id'), table_name='person_alias')
    op.drop_index(op.f('ix_person_alias_account_site_id'), table_name='person_alias')
    op.drop_table('person_alias')
