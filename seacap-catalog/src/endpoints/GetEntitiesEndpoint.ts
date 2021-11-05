import { FastifyInstance, RouteShorthandOptions } from "fastify";
import Entity from "../models/Entity";
import GetEntities from "../queries/GetEntities";
import IEndpoint from "./IEndpoint";

interface GetEntitiesQuerystring
{
    kind?: string;
    deleted?: boolean;
    offset?: number;
    limit?: number;
}

interface GetEntitiesParams
{
    repo: string;
}

// type GetEntitiesReq = GetEntitiesQuerystring & GetEntitiesParams;

export default class GetEntitiesEndpoint implements IEndpoint
{
    private readonly _getEntities: GetEntities;

    constructor(getEntities: GetEntities)
    {
        this._getEntities = getEntities;
    }

    register = (fastify: FastifyInstance) =>
    {
        type T = {
            Params: GetEntitiesParams;
            Querystring: GetEntitiesQuerystring;
            Reply: Entity[];
        };
    
        const options = {
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
            const myReq = { ...req.query, ...req.params };
            const entities = await this._getEntities.call(myReq);

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
}