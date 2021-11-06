import * as awilix from "awilix";
import DatabaseManager from "./DatabaseManager";
import GetEntitiesEndpoint from "./endpoints/GetEntitiesEndpoint";
import GetEntities from "./queries/GetEntities";
import GetEntitiesById from "./queries/GetEntitiesById";
import GetEntityIds from "./queries/GetEntityIds";
import GetRepos from "./queries/GetRepos";
import GetRepoStats from "./queries/GetRepoStats";

const SEACAP_PROJECTS_DIR = process.env.SEACAP_PROJECTS_DIR || "../projects";

export interface ICradle
{
    databaseDir: string;
    databaseManager: DatabaseManager;
    getEntityIds: GetEntityIds;
    getEntitiesById: GetEntitiesById;
    getEntities: GetEntities;
    getEntitiesEndpoint: GetEntitiesEndpoint;
    getRepoStats: GetRepoStats;
    getRepos: GetRepos;
}

export function createCradle()
{
    const container = awilix.createContainer<ICradle>({
        injectionMode: awilix.InjectionMode.CLASSIC
    });
    
    container.register({
        databaseDir: awilix.asValue(SEACAP_PROJECTS_DIR),
        databaseManager: awilix.asClass(DatabaseManager),
        getEntityIds: awilix.asClass(GetEntityIds),
        getEntitiesById: awilix.asClass(GetEntitiesById),
        getEntities: awilix.asClass(GetEntities),
        getEntitiesEndpoint: awilix.asClass(GetEntitiesEndpoint),
        getRepoStats: awilix.asClass(GetRepoStats),
        getRepos: awilix.asClass(GetRepos),
    });
    
    return container.cradle;
}