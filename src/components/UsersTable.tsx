"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";

interface PortalUser {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited";
}

const ROLES = [
  "Customer Portfolio Administrator",
  "Customer Site Manager",
  "S&A Operations / Helpdesk",
  "S&A Engineer",
  "Contractor Company Administrator",
  "Contractor Engineer",
  "Read-only Auditor",
];

export function UsersTable({ initialUsers }: { initialUsers: PortalUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);

  function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setUsers((prev) => [
      ...prev,
      { name: email.split("@")[0], email: email.trim(), role, status: "Invited" },
    ]);
    setEmail("");
    setShowForm(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-muted">
          Invitation-based onboarding only — role, organisation membership
          and property scope are assigned per user (section 2.2).
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
        >
          {showForm ? <X className="h-3.5 w-3.5" aria-hidden="true" /> : <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />}
          {showForm ? "Cancel" : "Invite user"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleInvite}
          className="mb-4 flex flex-col gap-2 rounded-md border border-border bg-bg p-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="invite-email" className="block text-xs font-medium text-ink">
              Work email
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.co.uk"
              className="mt-1 w-full rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div>
            <label htmlFor="invite-role" className="block text-xs font-medium text-ink">
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-md bg-brand-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Send invite
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Email</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-b border-border last:border-0">
                <td className="py-2.5 font-medium text-ink capitalize">{user.name}</td>
                <td className="py-2.5 text-muted">{user.email}</td>
                <td className="py-2.5 text-body">{user.role}</td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      user.status === "Active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
