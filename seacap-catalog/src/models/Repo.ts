import RepoStats from "./RepoStats";

export default interface Repo
{
    name: string;
    displayName: string;
    description: string;
    gitWeb: string | null;
    gitLeadRef: string;
    stats: RepoStats;
}