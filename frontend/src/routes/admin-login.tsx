import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      sessionStorage.setItem(
        "isAdmin",
        "true"
      );

      navigate({
        to: "/admin",
      });

    } else {

      setError(
        "Invalid credentials"
      );

    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="border rounded-xl p-8 w-[400px]">

        <h1 className="text-3xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Username"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-4"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={login}
          className="w-full bg-primary text-on-primary py-3 rounded-lg"
        >
          Login
        </button>

      </div>

    </div>
  );
}