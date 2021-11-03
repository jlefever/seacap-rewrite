export interface Repo
{
    name: string;
    displayName: string;
}

export interface Commit
{
    id: number;
    sha1: string;
    message: string;
}

export interface Entity
{
    id: number;
    name: string;
    kind: string;
    startLineno: number | null;
    endLineno: number | null;
    parent: Entity | null;
}