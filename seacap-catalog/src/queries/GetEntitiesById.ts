import DatabaseManager from "../DatabaseManager";
import Entity from "../models/Entity";
import IQuery from "./IQuery";

interface Req
{
    repo: string;
    entityIds: number[];
}

type Res = Entity[] | null;

interface EntityRow 
{
    id: number;
    parent_id: number | null,
    name: string;
    kind: string;
    start_lineno: number | null;
    end_lineno: number | null;
}

export default class GetEntityIds implements IQuery<Req, Res>
{
    private readonly _dbManager: DatabaseManager;

    constructor(databaseManager: DatabaseManager)
    {
        this._dbManager = databaseManager;
    }

    call = async (req: Req) =>
    {
        const db = this._dbManager.get(req.repo);

        if (!db) return null;

        const sql = `
            WITH RECURSIVE children AS (
                SELECT *, 0 AS dist
                FROM entities 
                WHERE id IN (${req.entityIds.join(",")})
                UNION ALL
                SELECT P.*, dist + 1
                FROM entities P
                INNER JOIN children C ON C.parent_id = P.id
            )
            SELECT * FROM children
            ORDER BY dist DESC
        `;

        const rows = (await this._dbManager.query<EntityRow>(req.repo, sql))!;

        const entities = new Map<number, Entity>();

        for (const row of rows)
        {
            let parent: Entity | null | undefined = null;

            if (row.parent_id !== null)
            {
                parent = entities.get(row.parent_id);

                if (parent === undefined)
                {
                    throw new Error("entities must be topologically sorted");
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

        return req.entityIds.map(id => entities.get(id)!);
    };
}