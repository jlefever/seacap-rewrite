import fastify from "fastify";
import fastifyHelmet from "fastify-helmet";
import fastifySwagger from "fastify-swagger";

const CATALOG_PORT = Number(process.env.CATALOG_PORT) || 4007;

const server = fastify({ logger: true });

server.register(fastifyHelmet);

server.addSchema({
    "$id": "repo",
    type: "object",
    description: "A git repository with some additional metadata",
    properties: {
        name: {
            type: "string",
            description: "A unique name for a repo"
        },
        displayName: {
            type: "string",
            description: "How this entity is displayed in user interfaces"
        }
    },
    additionalProperties: false,
    required: [
        "name",
        "displayName"
    ]
});

server.addSchema({
    "$id": "entity",
    type: "object",
    description: "A source code entity such as a file, class, method, etc.",
    properties: {
        id: {
            type: "integer",
            description: "A unique identifier for an entity"
        },
        name: {
            type: "string",
            description: "The local name of an entity"
        },
        kind: {
            type: "string",
            description: "The kind of entity"
        },
        parent: {
            "$ref": "entity",
            description: "The parent of an entity"
        },
        commits: {
            type: "array",
            description: "The commits where this entity was touched",
            items: {
                "$ref": "commit"
            }
        }
    },
    additionalProperties: false,
    required: [
        "id",
        "name",
        "kind",
        "commits"
    ]
});

server.addSchema({
    "$id": "commit",
    type: "object",
    description: "A git commit",
    properties: {
        id: {
            type: "integer",
            description: "A unique identifier for a commit"
        },
        sha1: {
            type: "string",
            description: "The SHA-1 hash of this commit"
        },
        message: {
            type: "string",
            description: "The commit message"
        }
    },
    additionalProperties: false,
    required: [
        "id",
        "sha1",
        "message"
    ]
});

server.register(fastifySwagger, {
    routePrefix: "/swagger",
    staticCSP: true,
    exposeRoute: true,
    swagger: {
        info: {
            title: "Catalog",
            description: "An API for accessing software engineering artifact data",
            version: "0.0.1"
        },
        host: `localhost:${CATALOG_PORT}`,
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
    }
});

server.register(require("./endpoints/getEntities"));

const startServer = async () =>
{
    try
    {
        console.log(`Starting seacap-catalog on port ${CATALOG_PORT}...`);
        await server.listen(CATALOG_PORT);
    }
    catch (err)
    {
        server.log.error(err);
        process.exit(1);
    }
};

startServer();