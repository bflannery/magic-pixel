"""adds person attribute tables

Revision ID: d34ba7ae70bb
Revises: 7b861936755a
Create Date: 2021-11-13 14:56:11.154905

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "d34ba7ae70bb"
down_revision = "7b861936755a"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "person",
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
        sa.Column("account_id", sa.BigInteger(), nullable=False),
        sa.Column("distinct_id", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=True),
        sa.Column("username", sa.Text(), nullable=True),
        sa.Column("first_name", sa.Text(), nullable=True),
        sa.Column("last_name", sa.Text(), nullable=True),
        sa.Column(
            "attributes",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name="person_account_id_fkey"
        ),
        sa.UniqueConstraint("account_id", "email", "username", name="uc_account_id_email_username"),
    )
    op.create_index(
        op.f("ix_person_account_id"), "person", ["account_id"], unique=False
    )
    op.create_index(op.f('ix_person_email'), 'person', ['email'], unique=True)
    op.create_index(op.f('ix_person_distinct_id'), 'person', ['distinct_id'], unique=True)

    op.execute("DROP TYPE IF EXISTS attributetypeenum")
    op.create_table(
        "attribute",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("(now() at time zone 'utc')"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("(now() at time zone 'utc')"),
            nullable=True,
        ),
        sa.Column("account_id", sa.BigInteger(), nullable=False),
        sa.Column(
            "type",
            sa.Enum(
                "EMAIL",
                "FIRST_NAME",
                "LAST_NAME",
                "OCCUPATION",
                "PHONE",
                "ADDRESS",
                "ADDRESS_2",
                "CITY",
                "STATE",
                "COUNTRY",
                "ZIP_CODE",
                "TEXT",
                name="attributetypeenum",
            ),
            nullable=False,
        ),
        sa.Column("name", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name="attribute_account_id_fkey"
        ),
    )
    op.create_index(
        op.f("ix_attribute_account_id"), "attribute", ["account_id"], unique=False
    )

    op.create_table(
        "person_attribute",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("(now() at time zone 'utc')"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("(now() at time zone 'utc')"),
            nullable=True,
        ),
        sa.Column("person_id", sa.BigInteger(), nullable=False),
        sa.Column("attribute_id", sa.BigInteger(), nullable=False),
        sa.Column("value", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(
            ["person_id"], ["person.id"], name="person_attribute_person_id_fkey"
        ),
        sa.ForeignKeyConstraint(
            ["attribute_id"],
            ["attribute.id"],
            name="person_attribute_attribute_id_fkey",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_person_attribute_attribute_id"),
        "person_attribute",
        ["attribute_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_person_attribute_person_id"),
        "person_attribute",
        ["person_id"],
        unique=False,
    )


def downgrade():
    op.drop_index(op.f("ix_person_attribute_person_id"), table_name="person_attribute")
    op.drop_index(
        op.f("ix_person_attribute_attribute_id"),
        table_name="person_attribute",
    )
    op.drop_constraint("person_attribute_person_id_fkey", "person_attribute")
    op.drop_constraint("person_attribute_attribute_id_fkey", "person_attribute")
    op.drop_table("person_attribute")

    op.drop_index(op.f("ix_attribute_account_id"), table_name="attribute")
    op.drop_constraint("attribute_account_id_fkey", "attribute")
    op.drop_table("attribute")

    op.drop_index(op.f("ix_person_account_id"), table_name="person")
    op.drop_index(op.f("ix_person_email"), table_name="person")
    op.drop_constraint("uc_account_id_email_username", "person", type_="unique")
    op.drop_constraint("person_account_id_fkey", "person")
    op.drop_table("person")

    op.execute("DROP TYPE IF EXISTS attributetypeenum")
