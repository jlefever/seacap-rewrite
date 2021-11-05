import DatabaseManager from "../DatabaseManager";
import Repo from "../models/Repo";
import GetRepoStats from "./GetRepoStats";
import IQuery from "./IQuery";

type Req = void;

type Res = Repo[];

export default class GetRepos implements IQuery<Req, Res>
{
    private readonly _databaseManager: DatabaseManager;
    private readonly _getRepoStats: GetRepoStats;

    constructor(databaseManager: DatabaseManager, getRepoStats: GetRepoStats)
    {
        this._databaseManager = databaseManager;
        this._getRepoStats = getRepoStats;
    }

    call = async (_: Req) =>
    {
        const names = this._databaseManager.getRepoNames();
        return Promise.all(names.map(name => this.createRepo(name)));
    };

    private createRepo = async (name: string): Promise<Repo> =>
    {
        const meta = new Map<string, string>();

        const sql = "SELECT key, value FROM meta";

        const manager = this._databaseManager;

        for (var row of (await manager.query<{ key: string, value: string; }>(name, sql))!)
        {
            meta.set(row.key, row.value);
        }

        if (!meta.has("gitLeadRef"))
        {
            throw new Error("missing meta key 'gitLeadRef'");
        }

        const stats = (await this._getRepoStats.call({ repo: name }))!;

        return {
            name,
            stats,
            displayName: meta.get("displayName") ?? name,
            description: meta.get("description") ?? "",
            gitWeb: meta.get("gitWeb") ?? null,
            gitLeadRef: meta.get("gitLeadRef")!
        };
    };
}
