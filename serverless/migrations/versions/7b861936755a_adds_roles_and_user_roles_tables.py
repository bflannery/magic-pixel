"""adds roles and user_roles tables
Revision ID: 7b861936755a
Revises: d714436f6d3b
Create Date: 2021-10-17 05:46:58.755599

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7b861936755a"
down_revision = "d714436f6d3b"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "role",
        sa.Column("id", sa.Integer(), nullable=False),
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
        sa.Column("name", sa.String(length=50), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "user_roles",
        sa.Column("id", sa.Integer(), nullable=False),
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
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("role_id", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["role_id"], ["role.id"], name="user_roles_role_id_fkey"
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["user.id"], name="user_roles_user_id_fkey"
        ),
    )


def downgrade():
    op.drop_constraint("user_roles_role_id_fkey", "user_roles")
    op.drop_constraint("user_roles_user_id_fkey", "user_roles")
    op.drop_table("user_roles")
    op.drop_table("role")
