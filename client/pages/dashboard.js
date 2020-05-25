import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const url = `https://${BASE_API_URL}/`;
  
  // authetication state
  const [authState, setAuth] = useState({
    authenticated: null,
    token: null,
  });
  // login form state
  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
  });
  // update current form state
  const [update, setUpdate] = useState({
    current: "",
  });

  const [data, setData] = useState({
    current: "",
    target: "",
  });

  // function that handle loging in,
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(`${url}auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...loginState }),
      });
      const data = await response.json();
      if ((await response.status) === 200 && (await data.token)) {
        setAuth({
          authenticated: true,
          token: data.token,
        });
        window.localStorage.setItem("token", data.token);
        setLoginState({
          ...loginState,
          username: "",
          password: "",
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // a function to handle change to login form inputs
  const handleLoginChange = (e) => {
    switch (e.target.type) {
      case "text":
        setLoginState({
          ...loginState,
          username: e.target.value,
        });
        break;
      case "password":
        setLoginState({
          ...loginState,
          password: e.target.value,
        });
        break;
    }
  };

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      if (!update) throw new Error("Enter a number");
      const response = await fetch(`${url}data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current: update.current,
          token: authState.token,
        }),
      });
      const data = await response.json();
      if ((await response.status) === 200 && (await data.current)) {
        setData({
          current: data.current,
          target: data.target,
        });
        setUpdate({
          current: "",
        });
      } else if (
        (await response.status) === 400 &&
        (await data.error) === "jwt expired"
      ) {
        throw new Error("Please login again!");
      } else if (
        (await response.status) === 400 &&
        (await data.error) === "invalid token"
      ) {
        throw new Error("Please login again!");
      } else {
        throw new Error("Please try again later, OR Contact Support");
      }
    } catch (error) {
      alert(error.message);
      setAuth({
        authenticated: false,
        token: null,
      });
    }
  };

  const handleUpdateChange = (e) => {
    switch (e.target.type) {
      case "number":
        setUpdate({
          current: e.target.value,
        });
        break;
    }
  };

  // function to ckeck if there a valid jwt in the local storage on page load
  // if not, it displayes login form by chaning auth state
  useEffect(() => {
    (async () => {
      try {
        const token = window.localStorage.getItem("token");
        //JSON.parse(window.localStorage.getItem('token'));
        if (!token) throw new Error("no token");
        const response = await fetch(`${url}token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.status !== 200) throw new Error("token expired!");
        setAuth({
          authenticated: true,
          token,
        });
      } catch (error) {
        console.log(error.message);
        setAuth({
          authenticated: false,
          token: null,
        });
        window.localStorage.clear();
      }
    })();
  }, []);
  // function to get the current and target values of donations
  useEffect(() => {
    (async () => {
      const response = await fetch(`${url}data`);
      const resJSON = await response.json();
      setData({
        current: await resJSON.current,
        target: await resJSON.target,
      });
    })();
  }, []);

  const dashboard = (
    <div className="container">
      <Head>
        <title>Dash Board</title>
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
            <p>{data.current ? data.current : "loading..."} USD</p>
          </div>
          <div className="card">
            <h3>New Current &rarr;</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="number"
                required
                placeholder="Enter new current"
                min="0"
                onChange={handleUpdateChange}
                value={update.current}
              />
              <input type="submit" value="submit" />
            </form>
          </div>
        </div>
      </main>

      <footer>
        <p>Track Donations, Organization Name</p>
        <Link href="/">
          <a>Home</a>
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
          width: 100%;
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
        .card form {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .card form input {
          height: 2.3rem;
          width: 100%;
          margin: 0.2rem 0;
          padding: 0;
          border: none;
          border-radius: 3px;
        }
        .card form input:hover,
        .card form input:focus,
        .card form input:active {
          outline: none;
        }

        .card form input[type="number"] {
          padding-left: 0.3rem;
          box-sizing: border-box;
          border: 1px solid #eaeaea;
        }
        .card form input[type="submit"] {
          background-color: #eaeaea;
          cursor: pointer;
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
    </div>
  );
  const login = (
    <div className="container">
      <Head>
        <title>Login</title>
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

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="username"
            onChange={handleLoginChange}
            value={loginState.username}
          />
          <input
            type="password"
            placeholder="password"
            onChange={handleLoginChange}
            value={loginState.password}
          />
          <input type="submit" value="Login" />
        </form>
      </main>

      <footer>
        <p>Track Donations, Organization Name</p>
        <Link href="/">
          <a>Home</a>
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

        form {
          margin: 1rem;
          width: 100%;
          padding: 1.5rem;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        form input {
          height: 2.8rem;
          width: 100%;
          margin: 0.2rem 0;
          padding: 0;
          border: none;
          border-radius: 3px;
          font-size: 1rem;
        }
        form input:hover,
        form input:focus,
        form input:active {
          outline: none;
        }

        form input[type="text"],
        form input[type="password"] {
          padding-left: 0.5rem;
          box-sizing: border-box;
          border: 1px solid #eaeaea;
        }
        form input[type="submit"] {
          cursor: pointer;
        }

        @media (max-width: 600px) {
          form {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );

  return authState.authenticated === true
    ? dashboard
    : authState.authenticated === false
    ? login
    : null;
}
