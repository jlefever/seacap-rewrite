import Entity from "../models/Entity";
import GetEntitiesById from "./GetEntitiesById";
import GetEntityIds from "./GetEntityIds";
import IQuery from "./IQuery";

interface Req
{
    repo: string;
    kind?: string;
    deleted?: boolean;
    offset?: number;
    limit?: number;
}

type Res = Entity[] | null;

export default class GetEntity implements IQuery<Req, Res>
{
    private readonly _getEntitiesById: GetEntitiesById;
    private readonly _getEntityIds: GetEntityIds;

    constructor(getEntitiesById: GetEntitiesById, getEntityIds: GetEntityIds)
    {
        this._getEntitiesById = getEntitiesById;
        this._getEntityIds = getEntityIds;
    }

    call = async (req: Req) =>
    {
        const entityIds = await this._getEntityIds.call(req);
        if (entityIds == null) return null;
        return await this._getEntitiesById.call({ repo: req.repo, entityIds });
    };
}