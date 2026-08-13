import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

export default function EditorialLogin() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================================================
  // CHECK EXISTING EDITORIAL LOGIN
  // ==================================================

  useEffect(() => {
    async function checkAuthentication() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response =
          await api.get("/auth/me");

        const role =
          response.data?.user?.role;

        if (
          role === "ADMIN" ||
          role === "EDITOR" ||
          role === "WRITER"
        ) {
          navigate(
            "/editorial",
            { replace: true }
          );
        }
      } catch (error) {
        localStorage.removeItem(
          "token"
        );
      }
    }

    checkAuthentication();
  }, [navigate]);

  // ==================================================
  // LOGIN
  // ==================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/login",
          {
            email:
              email.trim(),
            password
          }
        );

      const {
        token,
        user
      } = response.data;

      if (!token) {
        throw new Error(
          "No authentication token received."
        );
      }

      // ==================================================
      // STORE EDITORIAL TOKEN
      // ==================================================

      localStorage.setItem(
        "token",
        token
      );

      // ==================================================
      // OPTIONAL USER INFORMATION
      // ==================================================

      if (user) {
        localStorage.setItem(
          "editorialUser",
          JSON.stringify(user)
        );
      }

      // ==================================================
      // GO TO EDITORIAL CMS
      // ==================================================

      navigate(
        "/editorial",
        { replace: true }
      );

    } catch (error) {
      console.error(
        "Editorial login error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="impilo-editorial-login">

      <section className="impilo-login-card">

        <header>

          <span>
            IMPILO
          </span>

          <h1>
            Editorial CMS
          </h1>

          <p>
            Sign in to manage
            editorial content.
          </p>

        </header>

        {error && (
          <div className="impilo-login-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <div className="impilo-login-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              autoComplete="email"
              placeholder="you@example.com"
              disabled={loading}
            />

          </div>

          <div className="impilo-login-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={loading}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

      </section>

    </main>
  );
}