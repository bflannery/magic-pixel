"""adds event browser table

Revision ID: 115bd9ee401c
Revises: c90938bbfda7
Create Date: 2021-09-22 20:29:33.895248

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "115bd9ee401c"
down_revision = "c90938bbfda7"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event_browser",
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
        sa.Column("name", sa.Text(), nullable=True),
        sa.Column("platform", sa.Text(), nullable=True),
        sa.Column("plugins", sa.JSON(), nullable=True),
        sa.Column("ua", sa.Text(), nullable=True),
        sa.Column("version", sa.Integer(), nullable=True),
        sa.Column("screen_cd", sa.Integer(), nullable=True),
        sa.Column("screen_height", sa.Integer(), nullable=True),
        sa.Column("screen_width", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["event_id"], ["event.id"], name="event_browser_event_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_event_browser_event_id"), "event_browser", ["event_id"], unique=False
    )


def downgrade():
    op.drop_constraint("event_browser_event_id_fkey", "event_browser")
    op.drop_index(op.f("ix_event_browser_event_id"), table_name="event_browser")
    op.drop_table("event_browser")
