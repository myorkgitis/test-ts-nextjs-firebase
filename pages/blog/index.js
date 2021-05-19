import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

import {generatePosts} from "../../helpers/utils";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Only fetch the title and blurb.
const FirestoreBlogPostsURL = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/posts?mask.fieldPaths=blurb&mask.fieldPaths=title`;
// eslint-disable-next-line no-undef
const fetcher = (url) => fetch(url).then((r) => r.json());

// eslint-disable-next-line require-jsdoc
export async function getServerSideProps(context) {
  const data = await fetcher(FirestoreBlogPostsURL);
  const posts = generatePosts(data);

  return {props: {posts}};
}

/**
 *
 * @param {any} props
 * @return {JSX.Element}
 * @constructor
 */
function Blog(props) {
  const initialData = props.posts;
  const {data} = useSWR(FirestoreBlogPostsURL, fetcher, {initialData});
  // initialData is already transformed, so only transform refetches
  const posts = data.documents ? generatePosts(data) : data;

  return (
    <div className="container">
      <Head>
        <title>Next.js on Firebase Hosting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <h1 className="title">Blog Posts</h1>
        <ul>
          <li>
            SSR page with <code>getServerSideProps()</code>
          </li>
          <li>
            Data fetched from Firestore use{" "}
            <a href="https://swr.now.sh/" target="_blank">
              SWR
            </a>{" "}
            during SSR
          </li>
          <li>
            Re-rendered on <em>each</em> request, so always latest data
          </li>
          <li>New posts will show on hard refresh</li>
          <ul>
            <li>(browsers cache the SSR result for some time)</li>
          </ul>
        </ul>

        <p className="description">Blog Posts</p>
        <div className="grid">
          {data &&
          posts.map((post) => (
            <Link
              href="blog/[pid]"
              as={`/blog/${post.pid}`}
              key={`${post.pid}`}
            >
              <a className="card">
                <h3>{post.title} &rarr;</h3>
                <p>{post.blurb}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>

      <Footer />

    </div>
  );
}

export default Blog;
