import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Dashboard() {
  const { data } = api.issue.getAll.useQuery();
  const user = useUser();

  return (
    <>
    <div>
      <button id="create">Create</button>
    <table id="issues">
      <tr>
        <th>Issue</th>
        <th>Status</th>
        <th>Created</th>
      </tr>
      {data?.map((issue) => (
      <tr>
        <td>{issue.title}</td>
        <td>{issue.status}</td>
        <td>{}</td>
      </tr>
      ))}
      </table>
    </div>
    </>
  );
}
