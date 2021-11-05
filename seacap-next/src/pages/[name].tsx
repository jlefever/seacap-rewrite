import PageTitle from "components/pageTitle";
import Repo from "@seacap/catalog/models/Repo";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { getCradle } from "serverutil";
import _ from "lodash";

interface RepoPageProps
{
    repo: Repo;
}

const RepoPage = ({ repo }: RepoPageProps) =>
(
    <div className="ui text container">
        <Head>
            <title>{repo.displayName}</title>
        </Head>
        <PageTitle className="ui header">{repo.displayName}</PageTitle>
        <p>{repo.description}</p>
    </div>
);

export const getStaticProps: GetStaticProps = async (context) =>
{
    const name = context.params!["name"];

    if (!name) return { notFound: true };

    const repos = await getCradle().getRepos.call();
    const repo = _.find(repos, r => r.name === name)!;
    return { props: { repo } };
};

export const getStaticPaths: GetStaticPaths = async () =>
{
    const repos = await getCradle().getRepos.call();
    const paths = repos.map(r => ({ params: { name: r.name } }));
    return { paths, fallback: false };
};

export default RepoPage;