import * as awilix from "awilix";
import DatabaseManager from "./DatabaseManager";
import GetEntitiesEndpoint from "./endpoints/GetEntitiesEndpoint";
import GetEntities from "./queries/GetEntities";
import GetEntitiesById from "./queries/GetEntitiesById";
import GetEntityIds from "./queries/GetEntityIds";

interface ICradle
{
    databaseDir: string;
    databaseManager: DatabaseManager;
    getEntityIds: GetEntityIds;
    getEntitiesById: GetEntitiesById;
    getEntities: GetEntities;
    getEntitiesEndpoint: GetEntitiesEndpoint;
}

const container = awilix.createContainer<ICradle>({
    injectionMode: awilix.InjectionMode.CLASSIC
});

container.register({
    databaseDir: awilix.asValue("./projects/"),
    databaseManager: awilix.asClass(DatabaseManager),
    getEntityIds: awilix.asClass(GetEntityIds),
    getEntitiesById: awilix.asClass(GetEntitiesById),
    getEntities: awilix.asClass(GetEntities),
    getEntitiesEndpoint: awilix.asClass(GetEntitiesEndpoint)
});

export default container.cradle;