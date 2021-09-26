import psycopg2

def _execute_sql(query):
    with psycopg2.connect(database='postgres', user='postgres') as conn:
        with conn.cursor() as curr:
            conn.autocommit = True
            curr.execute(query)

            