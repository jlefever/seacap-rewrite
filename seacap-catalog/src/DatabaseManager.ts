import fs from "fs";
import { basename, join } from "path";
import sqlite3 from "sqlite3";

export default class DatabaseManager
{
    private readonly _databaseDir: string;
    private readonly _databaseMap: Map<string, sqlite3.Database>;

    constructor(databaseDir: string)
    {
        this._databaseDir = databaseDir;
        this._databaseMap = createDbMap(this._databaseDir);
    }

    get = (repo: string) =>
    {
        return this._databaseMap.get(repo);
    };

    query = async <T>(repo: string, sql: string) =>
    {
        const db = this.get(repo);
        if (db === undefined) return null;
        return await query<T>(db, sql);
    };
}

function scanForDbFiles(dir: string)
{
    const projectsDir = join(process.cwd(), dir);
    const filenames = fs.readdirSync(projectsDir);

    return filenames.map((filename) =>
    {
        return join(projectsDir, filename);
    });
}

function createDbMap(dir: string)
{
    var dbMap = new Map<string, sqlite3.Database>();

    for (var path of scanForDbFiles(dir))
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