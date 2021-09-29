"""event target table

Revision ID: d714436f6d3b
Revises: 27aad7b1586b
Create Date: 2021-09-22 21:00:40.866270

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd714436f6d3b'
down_revision = '27aad7b1586b'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event_target",
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
        sa.Column("url", sa.Text(), nullable=True),
        sa.Column("selector", sa.Text(), nullable=True),
        sa.Column("parameters", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["event_id"], ["event.id"], name="event_target_event_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_event_target_event_id"), "event_target", ["event_id"], unique=False
    )


def downgrade():
    op.drop_constraint("event_target_event_id_fkey", "event_target")
    op.drop_index(op.f("ix_event_target_event_id"), table_name="event_target")
    op.drop_table("event_target")
