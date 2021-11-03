import { promises as fs } from "fs";
import { basename, join } from "path";
import sqlite3 from "sqlite3";

export default class DbManager
{
    private readonly _dir: string;
    private _map?: Map<string, sqlite3.Database>;

    constructor(dir: string)
    {
        this._dir = dir;
    }

    load = async () =>
    {
        this._map = await createDbMap(this._dir);
    };

    get = (repo: string) =>
    {
        return this._map?.get(repo);
    };

    query = async <T>(repo: string, sql: string) =>
    {
        const db = this.get(repo);
        if (db === undefined) return undefined;
        return await query<T>(db, sql);
    };
}

async function scanForDbFiles(dir: string)
{
    const projectsDir = join(process.cwd(), dir);
    const filenames = await fs.readdir(projectsDir);

    return filenames.map((filename) =>
    {
        return join(projectsDir, filename);
    });
}

async function createDbMap(dir: string)
{
    var dbMap = new Map<string, sqlite3.Database>();

    for (var path of await scanForDbFiles(dir))
    {
        const name = basename(path, ".db");
        const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY);
        dbMap.set(name, db);
    }

    return dbMap;
}

function query<T>(db: sqlite3.Database, sql: string): Promise<T[]>
{
    return new Promise((resolve, reject) =>
    {
        db.all(sql, (err, rows) =>
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(rows);
            }
        });
    });
}