import Repo from "@seacap/catalog/models/Repo";
import Link from "next/link";
import React from "react";
import GithubTagLink from "./github/githubTagLink";
import MyIcon from "./myIcon";

interface RepoListProps
{
    repos: Repo[];
}

const RepoList = ({ repos }: RepoListProps) =>
(
    <div className="ui divided items">
        {repos.map(repo => (
            <div key={repo.name} className="item">
                <div className="content">
                    <Link href={`/${encodeURIComponent(repo.name)}`}>
                        <a className="header">{repo.displayName}</a>
                    </Link>
                    <div className="meta">
                        <span>{repo.stats.numCommits} commits</span>
                        <span>&#183;</span>
                        <span>{repo.stats.numFiles} files</span>
                        <span>&#183;</span>
                        <span>{repo.stats.numEntities} entities</span>
                    </div>
                    <div className="description">
                        <p>{repo.description}</p>
                    </div>
                    <div className="extra">
                        <GithubTagLink gitWebUrl={repo.gitWeb}
                            tag={repo.gitLeadRef}
                            style={{ "color": "rgba(0, 0, 0, 0.4)" }}
                        >
                            <MyIcon name="code branch" />{repo.gitLeadRef}
                        </GithubTagLink>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default RepoList;