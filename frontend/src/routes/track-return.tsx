import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/track-return")({
  component: TrackReturnPage,
});

function TrackReturnPage() {
  const [email, setEmail] = useState("");
  const [returns, setReturns] = useState<any[]>([]);

  async function searchReturns() {
    const response = await fetch(
      `http://127.0.0.1:8000/customer-returns?email=${email}`
    );

    const data = await response.json();

    setReturns(data);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        Track Your Return
      </h1>

      <div className="flex gap-3 mb-8">

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 border rounded-lg p-3"
        />

        <button
          onClick={searchReturns}
          className="px-6 py-3 rounded-lg bg-primary text-on-primary hover:opacity-90"
        >
          Search
        </button>

      </div>

      {returns.length === 0 && email && (
        <p className="text-gray-500 mb-4">
          No returns found.
        </p>
      )}

      <div className="space-y-4">

        {returns.map((r) => (

          <div
            key={r.id}
            className="border rounded-xl p-5"
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-semibold text-lg">
                  Return #{r.id}
                </h3>

                <p className="text-gray-600">
                  {r.product_title}
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  r.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : r.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {r.status === "Pending" && "🟡 Pending"}
                {r.status === "Approved" && "🟢 Approved"}
                {r.status === "Rejected" && "🔴 Rejected"}
              </span>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-gray-500">
                  Reason
                </p>

                <p>
                  {r.reason
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (c: string) =>
                      c.toUpperCase()
                    )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Resolution
                </p>

                <p>
                  {r.return_type
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (c: string) =>
                      c.toUpperCase()
                    )}
                </p>
              </div>

            </div>

          </div>

        ))}

      </div>

      {returns.length > 0 && (

        <button
          onClick={() => {
            setEmail("");
            setReturns([]);
          }}
          className="mt-6 px-4 py-2 rounded-lg border hover:bg-gray-100"
        >
          Track Another Return
        </button>

      )}

      <div className="mt-6">
  <button
    onClick={() => window.location.href = "/"}
    className="px-6 py-3 rounded-lg border border-outline-variant font-semibold hover:bg-surface-container transition-all"
  >
    ← Back to Home
  </button>
</div>

    </div>
  );
}