"""adds event table

Revision ID: c90938bbfda7
Revises: 763e460bce3c
Create Date: 2021-09-22 22:44:23.847065

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "c90938bbfda7"
down_revision = "763e460bce3c"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "event",
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
        sa.Column("site_id", sa.Text(), nullable=False),
        sa.Column("account_id", sa.BigInteger(), nullable=False),
        sa.Column("person_id", sa.BigInteger(), nullable=False),
        sa.Column("q_id", sa.Text(), nullable=True),
        sa.Column("session_id", sa.Text(), nullable=True),
        sa.Column("visitor_id", sa.Text(), nullable=True),
        sa.Column("user_id", sa.Text(), nullable=True),
        sa.Column("user_profile", sa.Text(), nullable=True),
        sa.Column("event_timestamp", sa.DateTime(), nullable=False),
        sa.Column("event_type", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name="event_account_id_fkey"
        ),
        sa.ForeignKeyConstraint(
            ["person_id"], ["person.id"], name="event_person_id_fkey"
        ),
    )
    op.create_index(op.f("ix_event_site_id"), "event", ["site_id"], unique=False)
    op.create_index(op.f("ix_event_event_type"), "event", ["event_type"], unique=False)
    op.create_index(op.f('ix_event_person_id'), 'event', ['person_id'], unique=False)
    op.create_index(op.f('ix_event_account_id'), 'event', ['account_id'], unique=False)

def downgrade():
    op.drop_constraint("event_account_id_fkey", "event")
    op.drop_constraint("event_person_id_fkey", "event")
    op.drop_index(op.f("ix_event_event_type"), table_name="event")
    op.drop_index(op.f("ix_event_site_id"), table_name="event")
    op.drop_index(op.f("ix_event_person_id"), table_name="event")
    op.drop_index(op.f("ix_event_account_id"), table_name="event")
    op.drop_table("event")
