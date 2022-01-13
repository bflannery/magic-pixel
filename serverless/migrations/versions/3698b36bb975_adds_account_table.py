""" adds account table

Revision ID: 3698b36bb975
Revises:
Create Date: 2021-10-04 20:14:37.166720

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "3698b36bb975"
# down_revision = ""
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "account",
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
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column(
            "is_active", sa.Boolean(), server_default=sa.text("false"), nullable=False
        ),
        sa.Column("industry", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_account_name"), "account", ["name"], unique=True)

    op.create_table(
        "account_site",
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
        sa.Column("account_id", sa.BigInteger(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),

        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name="account_site_account_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_account_site_account_id"), "account_site", ["account_id"], unique=False
    )


def downgrade():
    op.drop_index(op.f("ix_account_site_account_id"), table_name="account_site")
    op.drop_constraint("account_site_account_id_fkey", "account_site")
    op.drop_table("account_site")

    op.drop_index(op.f("ix_account_name"), table_name="account")
    op.drop_table("account")