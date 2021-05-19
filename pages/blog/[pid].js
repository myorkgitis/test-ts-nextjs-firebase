import Head from "next/head";
import {useRouter} from "next/router";
import Error from "next/error";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FirestoreBlogPostsURL = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/posts`;


// eslint-disable-next-line require-jsdoc
export async function getStaticPaths() {
  // by returning an empty list, we are forcing each page to
  // be rendered on request.
  // these pages will be rendered on first request.
  // the resultant .html and .json will be cached by the CDN, wit
  // cache-control: public,max-age=31536000,stale-while-revalidate
  // this means that the user will receive the pre-computed page on each request
  // and then each page will be recomputed behind the scenes.
  // be called per request increasing our costs.

  // firebase hosting deployment should invalidate these cached values
  // additionally, a new `next build` will create a new Build ID which is
  // used in the path for the returned .json data file.
  return {
    paths: [],
    fallback: true,
  };
}

// This function gets called at on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
// eslint-disable-next-line require-jsdoc
export async function getStaticProps({params}) {
  try {
    // Call an external API endpoint to get posts.
  // eslint-disable-next-line no-undef
    const res = await fetch(`${FirestoreBlogPostsURL}/${params.pid}`);
    const post = await res.json();
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        post: {
          pid: params.pid,
          title: post.fields.title.stringValue,
          blurb: post.fields.blurb.stringValue,
          content: post.fields.content.stringValue, // html
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return {props: {}};
  }
}

// posts will be populated by getStaticProps() at either:
// - build time
// - first request
// eslint-disable-next-line require-jsdoc
function Post({post}) {
  const router = useRouter();

  if (!router.isFallback && !post) {
    return <Error statusCode={404} title="No Blog Post with the provided ID" />;
  }

  if (router.isFallback) {
    return (
      <div className="container">
        <main>
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <h1 className="title">{post.title}</h1>
        <p className="description">{post.blurb}</p>
        <ul>
          <li>
                        SSG page with <code>getStaticProps()</code> &{" "}
            <code>getStaticPaths()</code> with <code>fallback:true</code>
          </li>
          <li>
                        page is rendered server-side on <em>first</em> request
          </li>
          <li>fallback loading page is rendered if no CDN cache of page</li>
          <li>
post data is fetched from Firestore server-side using next.js
                        polyfilled <code>fetch</code>
          </li>
          <li>
                        page is cached on CDN with the following cache-controls:
            <code>
'Cache-Control',s-maxage=31536000, stale-while-revalidate
            </code>
          </li>
          <ul>
            <li>CDN cached result is served if possible</li>
            <li>
behind the scenes, requests are made to the Next.js server to
                            refresh the page content
            </li>
            <li>stale while revalidate is not ideal for these types of pages
              {/* eslint-disable-next-line max-len */}
              as we probably don't want to call the Cloud Function in the background
on every request. It is slightly better than SSR, but still
                            expensive.
            </li>
            <li>
SSR at least lets us set the Cache-Control settings ourselves, so
                            we can not send <code>stale-while-revalidate</code>
            </li>
          </ul>
        </ul>
        <div dangerouslySetInnerHTML={{__html: post.content}} />
      </main>

      <Footer />

    </div>
  );
}

export default Post;
