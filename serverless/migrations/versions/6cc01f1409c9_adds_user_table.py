"""adds user table

Revision ID: 6cc01f1409c9
Revises: 3698b36bb975
Create Date: 2021-10-05 04:51:39.913791

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "6cc01f1409c9"
down_revision = "3698b36bb975"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user",
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
        sa.Column("account_id", sa.BigInteger(), nullable=True),
        sa.Column("auth0_id", sa.Text(), nullable=True),
        sa.Column("first_name", sa.Text(), nullable=True),
        sa.Column("last_name", sa.Text(), nullable=True),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("last_login_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name="user_account_id_fkey"
        ),
    )

    op.create_index(op.f("ix_user_account_id"), "user", ["account_id"], unique=False)
    op.create_index(op.f("ix_user_auth0_id"), "user", ["auth0_id"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_user_auth0_id"), table_name="user")
    op.drop_index(op.f("ix_user_account_id"), table_name="user")
    op.drop_constraint("user_account_id_fkey", "user")
    op.drop_table("user")
