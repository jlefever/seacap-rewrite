import DatabaseManager from "../DatabaseManager";
import IQuery from "./IQuery";

interface Req
{
    repo: string;
    kind?: string;
    deleted?: boolean;
    offset?: number;
    limit?: number;
}

type Res = number[] | null;

export default class GetEntityIds implements IQuery<Req, Res>
{
    private readonly _databaseManager: DatabaseManager;

    constructor(databaseManager: DatabaseManager)
    {
        this._databaseManager = databaseManager;
    }

    call = async (req: Req) =>
    {
        const db = this._databaseManager.get(req.repo);

        if (!db) return null;

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
            SELECT id FROM parents
            WHERE 1
            ${req.kind ? `AND kind = '${req.kind}'` : ""}
            ${req.deleted ? "" : "AND start_lineno IS NOT NULL"}
            ${req.limit ? `LIMIT ${req.limit}` : ""}
            ${req.offset ? `OFFSET ${req.offset}` : ""}
        `;

        const rows = await this._databaseManager.query<{id: number}>(req.repo, sql);
        return rows!.map(r => r.id);
    };
}