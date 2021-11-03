import DbManager from "../dbManager";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Entity } from "types";

interface GetEntitiesQuery
{
    kind?: string;
    offset?: number;
    limit?: number;
    deleted?: boolean;
}

interface GetEntitiesParams
{
    repo: string;
}

type GetEntitiesReq = GetEntitiesQuery & GetEntitiesParams;

interface EntityRow 
{
    id: number;
    parent_id: number | null,
    name: string;
    kind: string;
    start_lineno: number | null;
    end_lineno: number | null;
}

const getEntitiesById = async (dbManager: DbManager, repo: string, ids: number[]) =>
{
    const sql = `
        WITH RECURSIVE children AS (
            SELECT *, 0 AS dist
            FROM entities 
            WHERE id IN (${ids.join(",")})
            UNION ALL
            SELECT P.*, dist + 1
            FROM entities P
            INNER JOIN children C ON C.parent_id = P.id
        )
        SELECT * FROM children
        ORDER BY dist DESC
    `;

    const rows = await dbManager.query<EntityRow>(repo, sql);

    if (!rows) return undefined;

    const entities = new Map<number, Entity>();

    for (const row of rows)
    {
        let parent: Entity | null | undefined = null;

        if (row.parent_id !== null)
        {
            parent = entities.get(row.parent_id);

            if (parent === undefined)
            {
                throw new Error();
            }
        }

        const entity: Entity = {
            id: row.id,
            name: row.name,
            kind: row.kind,
            parent: parent,
            startLineno: row.start_lineno,
            endLineno: row.end_lineno
        };

        entities.set(entity.id, entity);
    }

    return entities;
};

const getEntities = async (dbManager: DbManager, req: GetEntitiesReq): Promise<Entity[] | undefined> =>
{
    const sql = `
        WITH RECURSIVE parents AS (
            SELECT *, 0 as level
            FROM entities 
            WHERE parent_id IS NULL
            UNION ALL
            SELECT C.*, P.level + 1
            FROM entities C
            INNER JOIN parents P ON P.id = C.parent_id
            ORDER BY level DESC, kind, name
        )
        SELECT * FROM parents
        WHERE 1
        ${req.kind ? `AND kind = '${req.kind}'` : ""}
        ${req.deleted ? "" : "AND start_lineno IS NOT NULL"}
        ${req.limit ? `LIMIT ${req.limit}` : ""}
        ${req.offset ? `OFFSET ${req.offset}` : ""}
    `;

    const rows = await dbManager.query<EntityRow>(req.repo, sql);
    if (!rows) return undefined;
    var entities = await getEntitiesById(dbManager, req.repo, rows.map(r => r.id));
    return rows.map(r => entities?.get(r.id)!);
};

export default async function (fastify: FastifyInstance)
{
    type T = {
        Params: GetEntitiesParams;
        Querystring: GetEntitiesQuery;
        Reply: Entity[];
    };

    const options: RouteShorthandOptions = {
        schema: {
            operationId: "getEntities",
            description: "Get entities from a repo",
            params: {
                "repo": { type: "string" }
            },
            querystring: {
                "kind": { type: "string" },
                "limit": { type: "integer" },
                "offset": { type: "integer" },
                "deleted": { type: "boolean" }
            },
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: true
                    }
                }
            }
        }
    };

    fastify.get<T>("/repo/:repo/entities", options, async (req, res) =>
    {
        const manager = new DbManager("projects");
        await manager.load();
        const entities = await getEntities(manager, { ...req.query, ...req.params });

        if (entities)
        {
            res.code(200).send(entities);
        }
        else
        {
            res.callNotFound();
        }
    });
}
