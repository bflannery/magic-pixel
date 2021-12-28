"""adds person table

Revision ID: d34ba7ae70bb
Revises: 7b861936755a
Create Date: 2021-11-13 14:56:11.154905

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "d34ba7ae70bb"
down_revision = "7b861936755a"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "person",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("(now() at time zone 'utc')"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("(now() at time zone 'utc')"),
            nullable=True,
        ),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.Column("account_id", sa.BigInteger(), nullable=False),
        sa.Column("distinct_id", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=True),
        sa.Column(
            "attributes",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name="person_account_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_person_account_id"), "person", ["account_id"], unique=False
    )
    op.create_index(op.f('ix_person_email'), 'person', ['email'], unique=True)
    op.create_index(op.f('ix_person_distinct_id'), 'person', ['distinct_id'], unique=True)


def downgrade():
    op.drop_index(op.f("ix_person_distinct_id"), table_name="person")
    op.drop_index(op.f("ix_person_email"), table_name="person")
    op.drop_index(op.f("ix_person_account_id"), table_name="person")
    op.drop_constraint("person_account_id_fkey", "person")
    op.drop_table("person")
