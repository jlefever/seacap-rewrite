import _ from "lodash";
import DatabaseManager from "../DatabaseManager";
import RepoStats from "../models/RepoStats";
import IQuery from "./IQuery";

interface Req
{
    repo: string;
}

type Res = RepoStats | null;

export default class GetRepoStats implements IQuery<Req, Res>
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

        const numEntitiesSql = `
            SELECT COUNT(*) AS count FROM entities
            WHERE
                start_lineno IS NOT NULL AND
                end_lineno IS NOT NULL
        `;

        const numFilesSql = `
            SELECT COUNT(*) AS count FROM entities
            WHERE
                start_lineno IS NOT NULL AND
                end_lineno IS NOT NULL AND
                kind = 'file'
        `;

        const numCommitsSql = "SELECT COUNT(*) AS count FROM commits";

        const queries = [
            this._databaseManager.query<{ count: number; }>(req.repo, numEntitiesSql),
            this._databaseManager.query<{ count: number; }>(req.repo, numFilesSql),
            this._databaseManager.query<{ count: number; }>(req.repo, numCommitsSql)
        ];

        const res = (await Promise.all(queries)).map(r => _.first(r!)!);

        return {
            numEntities: res[0].count,
            numFiles: res[1].count,
            numCommits: res[2].count
        };
    };
}