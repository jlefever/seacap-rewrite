import { FastifyInstance } from "fastify";

export default interface IEndpoint
{
    register: (fastify: FastifyInstance) => void;
}