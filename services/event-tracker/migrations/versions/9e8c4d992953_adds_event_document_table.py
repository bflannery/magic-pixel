"""adds event document table

Revision ID: 9e8c4d992953
Revises: 115bd9ee401c
Create Date: 2021-09-22 20:51:46.001291

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "9e8c4d992953"
down_revision = "115bd9ee401c"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event_document",
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
        sa.Column("event_id", sa.BigInteger(), nullable=False),
        sa.Column("title", sa.Text(), nullable=True),
        sa.Column("document_url", sa.Text(), nullable=True),
        sa.Column("document_parameters", sa.JSON(), nullable=True),
        sa.Column("referrer_url", sa.Text(), nullable=True),
        sa.Column("referral_parameters", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["event_id"], ["event.id"], name="event_document_event_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_event_document_event_id"), "event_document", ["event_id"], unique=False
    )


def downgrade():
    op.drop_constraint("event_document_event_id_fkey", "event_document")
    op.drop_index(op.f("ix_event_document_event_id"), table_name="event_document")
    op.drop_table("event_document")
