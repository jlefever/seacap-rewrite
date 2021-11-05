import * as awilix from "awilix";
import DatabaseManager from "./DatabaseManager";
import GetEntitiesEndpoint from "./endpoints/GetEntitiesEndpoint";
import GetEntities from "./queries/GetEntities";
import GetEntitiesById from "./queries/GetEntitiesById";
import GetEntityIds from "./queries/GetEntityIds";
import GetRepos from "./queries/GetRepos";
import GetRepoStats from "./queries/GetRepoStats";

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

export function createCradle(projectsDir: string)
{
    const container = awilix.createContainer<ICradle>({
        injectionMode: awilix.InjectionMode.CLASSIC
    });
    
    container.register({
        databaseDir: awilix.asValue(projectsDir),
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