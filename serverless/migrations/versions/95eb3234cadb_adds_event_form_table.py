"""adds event form table

Revision ID: 95eb3234cadb
Revises: 9e8c4d992953
Create Date: 2021-09-22 20:54:40.993623

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "95eb3234cadb"
down_revision = "9e8c4d992953"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event_form",
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
        sa.Column("event_id", sa.BigInteger(), nullable=False),
        sa.Column("form_id", sa.Text(), nullable=False),
        sa.Column("form_fields", sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["event_id"], ["event.id"], name="event_form_event_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_event_form_event_id"), "event_form", ["event_id"], unique=False
    )


def downgrade():
    op.drop_constraint("event_form_event_id_fkey", "event_form")
    op.drop_index(op.f("ix_event_form_event_id"), table_name="event_form")
    op.drop_table("event_form")
