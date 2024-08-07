import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png?v=2020"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png?v=2020"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png?v=2020"
          />
          <link rel="manifest" href="/site.webmanifest?v=2020" />
          <link
            rel="mask-icon"
            href="/safari-pinned-tab.svg?v=2020"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/favicon.ico?v=2020" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <noscript>
            <style
              type="text/css"
              dangerouslySetInnerHTML={{
                __html: ".hide-if-noscript { display: none !important; }",
              }}
            />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
