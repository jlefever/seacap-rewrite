import "fomantic-ui-css/semantic.min.css"
import "icons/vscode-dark-icons/style.css";
import "icons/vscode-light-icons/style.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/layout";

const App = ({ Component, pageProps }: AppProps) =>
(
    <Layout>
        <Head>
            <title>SEA Captain</title>
        </Head>
        <Component {...pageProps} />
    </Layout>
);

export default App;
