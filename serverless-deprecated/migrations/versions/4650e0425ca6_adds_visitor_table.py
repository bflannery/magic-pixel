"""adds visitor table

Revision ID: 4650e0425ca6
Revises: d714436f6d3b
Create Date: 2022-01-12 19:54:27.535041

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "4650e0425ca6"
down_revision = "d714436f6d3b"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "visitor",
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
        sa.Column("account_site_id", sa.BigInteger(), nullable=False),
        sa.Column("visitor_uuid", sa.Text(), nullable=False),
        sa.Column("fingerprint", sa.Text(), nullable=False),
        sa.Column("language", sa.Text(), nullable=True),
        sa.Column("tz_offset", sa.Text(), nullable=True),
        sa.Column("browser_name", sa.Text(), nullable=True),
        sa.Column("platform", sa.Text(), nullable=True),
        sa.Column("plugins", sa.JSON(), nullable=True),
        sa.Column("ua", sa.Text(), nullable=True),
        sa.Column("version", sa.Integer(), nullable=True),
        sa.Column("screen_cd", sa.Integer(), nullable=True),
        sa.Column("screen_height", sa.Integer(), nullable=True),
        sa.Column("screen_width", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_site_id"],
            ["account_site.id"],
            name="visitor_account_site_id_fkey",
        ),
    )
    op.create_index(
        op.f("ix_visitor_visitor_uuid"),
        "visitor",
        ["visitor_uuid"],
        unique=False,
    )
    op.create_index(
        op.f("ix_visitor_fingerprint"), "visitor", ["fingerprint"], unique=False
    )


def downgrade():
    op.drop_index("ix_visitor_visitor_uuid")
    op.drop_constraint("visitor_account_site_id_fkey", "visitor")
    op.drop_table("visitor")
