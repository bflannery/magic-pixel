"""event locale table

Revision ID: 327adc538357
Revises: 95eb3234cadb
Create Date: 2021-09-22 20:57:31.294833

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "327adc538357"
down_revision = "95eb3234cadb"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event_locale",
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
        sa.Column("language", sa.Text(), nullable=True),
        sa.Column("tz_offset", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["event_id"], ["event.id"], name="event_locale_event_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_event_locale_event_id"), "event_locale", ["event_id"], unique=False
    )


def downgrade():
    op.drop_constraint("event_locale_event_id_fkey", "event_locale")
    op.drop_index(op.f("ix_event_locale_event_id"), table_name="event_locale")
    op.drop_table("event_locale")
