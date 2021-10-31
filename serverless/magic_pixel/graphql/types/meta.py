import graphene


class Node(graphene.Interface):
    id = graphene.ID(required=True)


class BaseDBObject(graphene.ObjectType):
    """Base graphql object type for any object that represents a database
    model with mp_id property. Will automatically add node interface and default
    the id resolver to model.mp_id.
    """

    @classmethod
    def __init_subclass_with_meta__(_, *args, interfaces=(), **kw):
        if Node not in interfaces:
            interfaces = (Node,) + interfaces
        return super().__init_subclass_with_meta__(*args, interfaces=interfaces, **kw)

    @staticmethod
    def resolve_id(db_node, _):
        return db_node.mp_id
