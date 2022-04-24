import enum
import operator
from sqlalchemy import or_, and_
from magic_pixel.utility import getattr_deep, b64encode_str, b64decode_str
from magic_pixel.models.account import Account


class SortDirection(enum.Enum):
    ASC = "ascending"
    DESC = "descending"


class Cursor:
    sort_dir = None
    sort = None
    next_value = None
    next_id = None

    def __init__(self, encoded_cursor):
        [self.sort_dir, self.sort, self.next_value, self.next_id] = map(
            b64decode_str, encoded_cursor.split(".")
        )
        if self.next_value == "None":
            self.next_value = None
        if self.next_id == "None":
            self.next_id = None


class Paginator:
    sort_model_map = {}
    sort_value_map = {}
    sort_table = {}
    sort_map = {}
    model = None

    def id_getter(self, v):
        return v.id

    def get_cursor(self, next_row, sort, sort_direction=SortDirection.ASC):
        if next_row is None:
            return None
        sort_value_getter = self.sort_value_map[sort]
        next_id = self.id_getter(next_row)
        next_value = None
        if callable(sort_value_getter):
            next_value = sort_value_getter(next_row)
        elif isinstance(sort_value_getter, str):
            next_value = getattr_deep(next_row, sort_value_getter)
        return ".".join(
            map(b64encode_str, [sort_direction, sort, str(next_value), str(next_id)])
        )

    def apply_cursor_to_query_builder(
        self, query_builder, sort, sort_dir, cursor_str=None
    ):
        cursor = Cursor(cursor_str) if cursor_str else None
        sort_field = self.sort_map[sort]
        id_field = self.model.id
        sort_table = self.sort_table.get(sort)
        if sort_table:
            query_builder.add_optional_table(sort_table)
        sort_attr = sort_field.nullsfirst()
        id_sort_attr = self.model.id
        comparator = operator.gt
        comparator_inclusive = operator.ge
        if sort_dir == SortDirection.DESC.value:
            sort_attr = sort_field.desc().nullslast()
            id_sort_attr = id_sort_attr.desc()
            comparator = operator.lt
            comparator_inclusive = operator.le

        query_builder.add_sort(sort_attr).add_sort(id_sort_attr)

        if cursor and cursor.next_id is not None:
            same_value_condition = and_(
                sort_field == cursor.next_value,
                comparator_inclusive(id_field, cursor.next_id),
            )

            cursor_filter = None
            if cursor.next_value is None:
                # next row's field is null, if we are sorting asc
                # then all other values are not null (or are null but have a higher id)
                if sort_dir == SortDirection.ASC.value:
                    cursor_filter = or_(
                        sort_field.isnot(None),
                        same_value_condition,
                    )
                # next row's field is null, if we are sorting desc
                # then all other values are also null , just have lower id's
                else:
                    cursor_filter = same_value_condition
            elif comparator == operator.gt:
                cursor_filter = or_(
                    comparator(sort_field, cursor.next_value), same_value_condition
                )
            else:
                # if comparing less than, also include null values as well
                # as they go last
                cursor_filter = or_(
                    comparator(sort_field, cursor.next_value),
                    sort_field.is_(None),
                    same_value_condition,
                )
            if cursor_filter is not None:
                query_builder.add_filter(cursor_filter)

        return query_builder

    def build_limitless_query(
        self, query, sort, sort_dir, cursor_str=None, is_group_by=False
    ):
        # TODO if cursor check sort, dir are same as in cursor
        cursor = Cursor(cursor_str) if cursor_str else None
        sort_field = self.sort_map[sort]
        id_field = self.model.id
        sort_attr = sort_field.nullsfirst()
        id_model = (
            self.model
            if not self.sort_model_map.get(sort)
            else self.sort_model_map.get(sort)
        )
        id_sort_attr = id_model.id
        comparator = operator.gt
        comparator_inclusive = operator.ge
        if sort_dir == SortDirection.DESC.value:
            sort_attr = sort_field.desc().nullslast()
            id_sort_attr = id_sort_attr.desc()
            comparator = operator.lt
            comparator_inclusive = operator.le

        if cursor and cursor.next_id is not None:
            same_value_condition = and_(
                sort_field == cursor.next_value,
                comparator_inclusive(id_field, cursor.next_id),
            )

            cursor_filter = None
            if cursor.next_value is None:
                # next row's field is null, if we are sorting asc
                # then all other values are not null (or are null but have a higher id)
                if sort_dir == SortDirection.ASC.value:
                    cursor_filter = or_(
                        sort_field.isnot(None),
                        same_value_condition,
                    )
                # next row's field is null, if we are sorting desc
                # then all other values are also null , just have lower id's
                else:
                    cursor_filter = same_value_condition
            elif comparator == operator.gt:
                cursor_filter = or_(
                    comparator(sort_field, cursor.next_value), same_value_condition
                )
            else:
                # if comparing less than, also include null values as well
                # as they go last
                cursor_filter = or_(
                    comparator(sort_field, cursor.next_value),
                    sort_field.is_(None),
                    same_value_condition,
                )
            query = (
                query.having(cursor_filter)
                if is_group_by
                else query.filter(cursor_filter)
            )
        return query.order_by(sort_attr, id_sort_attr)

    def get_paged(self, query, sort, sort_dir, limit, cursor=None, is_group_by=False):
        query = self.build_limitless_query(query, sort, sort_dir, cursor, is_group_by)
        query = query.limit(limit + 1)
        page = query.all()
        next_cursor = None
        if len(page) == limit + 1:
            next_cursor_value = page.pop()
            next_cursor = self.get_cursor(next_cursor_value, sort, sort_dir)

        return page, next_cursor


class AccountPaginator(Paginator):
    model = Account
    sort_map = {
        "name": Account.name,
    }
    sort_value_map = {
        "name": "name",
    }
