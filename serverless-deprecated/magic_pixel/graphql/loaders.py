from itertools import groupby
from promise import Promise
from promise.dataloader import DataLoader


def db_id_loader(nodes):
    """ Load a db object by a db id, keys are (SQLAlchemyObject, id) """

    results_by_node = {}
    # nodes is a mixed bag of tables and ids, group by table they are targeting
    table_groups = groupby(nodes, lambda n: n[0])
    for (table, table_nodes) in table_groups:
        ids = [n[1] for n in table_nodes]
        table_rows = table.query.filter(table.id.in_(ids)).all()
        by_node = {(table, r.id): r for r in table_rows}
        results_by_node.update(by_node)

    return Promise.resolve([results_by_node[n] for n in nodes])


def create_loaders():
    return {
        "db_id_loader": DataLoader(db_id_loader),
    }
