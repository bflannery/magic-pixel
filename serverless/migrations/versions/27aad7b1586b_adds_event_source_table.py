"""adds event source table

Revision ID: 27aad7b1586b
Revises: 327adc538357
Create Date: 2021-09-22 20:59:11.507329

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '27aad7b1586b'
down_revision = '327adc538357'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event_source",
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
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("parameters", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["event_id"], ["event.id"], name="event_source_event_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_event_source_event_id"), "event_source", ["event_id"], unique=False
    )


def downgrade():
    op.drop_constraint("event_source_event_id_fkey", "event_source")
    op.drop_index(op.f("ix_event_source_event_id"), table_name="event_source")
    op.drop_table("event_source")
