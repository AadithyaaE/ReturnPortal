import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  function logout() {
  sessionStorage.removeItem("isAdmin");

  navigate({
    to: "/admin-login",
  });
}
  const [summary, setSummary] = useState<any>(null);
  const [returns, setReturns] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
async function updateStatus(
  returnId: number,
  status: string
) {

  await fetch(
    `http://127.0.0.1:8000/returns/${returnId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const updatedReturns = await fetch(
    "http://127.0.0.1:8000/returns"
  );

  const data = await updatedReturns.json();

  setReturns(data);
  const summaryResponse = await fetch(
  "http://127.0.0.1:8000/return-summary"
);

const summaryData = await summaryResponse.json();

setSummary(summaryData);

}
useEffect(() => {

  const isAdmin =
    sessionStorage.getItem("isAdmin");

  if (!isAdmin) {

    navigate({
      to: "/admin-login",
    });

  }

}, [navigate]);
useEffect(() => {

  fetch("http://127.0.0.1:8000/return-summary")
    .then(res => res.json())
    .then(data => {
      setSummary(data);
    });

  fetch("http://127.0.0.1:8000/returns")
    .then(res => res.json())
    .then(data => {
      setReturns(data);
    });

}, []);

const filteredReturns = returns.filter((r) => {

  const matchesFilter =
    filter === "All"
      ? true
      : r.status === filter;

  const matchesSearch =

    r.product_title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

  return (
    matchesFilter &&
    matchesSearch
  );

});
  


return (
  <div className="max-w-7xl mx-auto p-8">
<div className="flex justify-between items-center mb-8">

  <h1 className="text-4xl font-bold">
    SwiftReturn AI Dashboard
  </h1>

  <div className="flex gap-3">

    <button
      onClick={() => navigate({ to: "/" })}
      className="px-5 py-2 border rounded-lg"
    >
      Home
    </button>

    <button
      onClick={logout}
      className="px-5 py-2 border rounded-lg"
    >
      Logout
    </button>

  </div>

</div>



    {summary && (

      <div className="grid grid-cols-4 gap-4">

        <div className="border rounded-xl p-5">
          <p>Total Returns</p>
          <h2 className="text-3xl font-bold">
            {summary.total_returns}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p>Pending</p>

          <h2 className="text-3xl font-bold">
            {summary.pending}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p>Approved</p>
          <h2 className="text-3xl font-bold">
            {summary.approved}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p>Rejected</p>
          <h2 className="text-3xl font-bold">
            {summary.rejected}
          </h2>
        </div>

      </div>

    )}

    <div className="mt-10">

  <h2 className="text-2xl font-semibold mb-4">
    Recent Returns
  </h2>

  <input
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  placeholder="Search by product..."
  className="w-full mb-4 px-4 py-3 border rounded-lg"
/>

  <div className="flex gap-3 mb-4">

  {["All", "Pending", "Approved", "Rejected"].map(
    (status) => (

      <button
        key={status}
        onClick={() => setFilter(status)}
className={`px-4 py-2 rounded-lg transition-all ${
  filter === status
    ? "bg-primary text-on-primary shadow-md"
    : "hover:bg-gray-100"
}`}
      >
        {status}
{" "}
(
{
  status === "All"
    ? summary?.total_returns
    : status === "Pending"
    ? summary?.pending
    : status === "Approved"
    ? summary?.approved
    : summary?.rejected
}
)
      </button>

    )
  )}

</div>

  <div className="border rounded-xl overflow-hidden">

    <table className="w-full">

      <thead className="border-b">
        <tr>
          <th className="text-left p-4">ID</th>
          <th className="text-left p-4">Product</th>
          <th className="text-left p-4">Reason</th>
          <th className="text-left p-4">Type</th>
          <th className="text-left p-4">Status</th>
          <th className="text-left p-4">Actions</th>
        </tr>
      </thead>

      <tbody>

        {filteredReturns.map((r) => (

          <tr key={r.id} className="border-b">

            <td className="p-4">
              {r.id}
            </td>

            <td className="p-4">
              {r.product_title}
            </td>

            <td className="p-4">
              {r.reason}
            </td>

            <td className="p-4">
              {r.return_type}
            </td>

<td className="p-4">

  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${
      r.status === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : r.status === "Approved"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {r.status}
  </span>

</td>

<td className="p-4">

  {r.status === "Pending" && (
    <>
      <button
        onClick={() => updateStatus(r.id, "Approved")}
        className="px-3 py-1 mr-2 rounded-lg bg-green-600 text-white"
      >
        Approve
      </button>

      <button
        onClick={() => updateStatus(r.id, "Rejected")}
        className="px-3 py-1 rounded-lg bg-red-600 text-white"
      >
        Reject
      </button>
    </>
  )}

  {r.status === "Approved" && (
    <button
      onClick={() => updateStatus(r.id, "Rejected")}
      className="px-3 py-1 rounded-lg bg-red-600 text-white"
    >
      Reject
    </button>
  )}

  {r.status === "Rejected" && (
    <button
      onClick={() => updateStatus(r.id, "Approved")}
      className="px-3 py-1 rounded-lg bg-green-600 text-white"
    >
      Approve
    </button>
  )}

</td>
         


          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

  </div>
)};