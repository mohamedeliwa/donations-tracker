import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const url = `https://${BASE_API_URL}/`;
  const [state, setState] = useState({
    current: "",
    target: "",
  });

  // function to get the cuurent and target values of donations
  useEffect(() => {
    (async () => {
      const response = await fetch(`${url}data`);
      const data = await response.json();
      setState({
        current: await data.current,
        target: await data.target,
      });
    })();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main>
        <h1 className="title">
          Track <span style={{ color: "#0064d6" }}>Donations</span>,
        </h1>

        <p className="description">Organization Name</p>

        <div className="grid">
          <div className="card">
            <h3>Current &rarr;</h3>
            <p>{state.current ? state.current : "loading..."} USD</p>
          </div>
          <div className="card">
            <h3>Target &rarr;</h3>
            <p>{state.target ? state.target : "loading..."} USD</p>
          </div>
        </div>
      </main>

      <footer>
        <p>Track Donations, Organization Name</p>
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          text-align: center;
          font-family: "Great Vibes", cursive;
          font-size: 1.3rem;
        }
        footer a {
          text-decoration: none;
        }
        footer a:link,
        footer a:visited,
        footer a:hover,
        footer a:active {
          color: inherit;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        .grid {
          width: 90%;
          flex-direction: column;
        }
        .card {
          margin: 1rem;
          min-height: 130px;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 400;
        }

        .card p {
          margin: 0;
          text-align: center;
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
          }
          .card {
            min-height: auto;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
