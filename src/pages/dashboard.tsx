import { useUser } from "@clerk/nextjs";
import Link from 'next/link'

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
        <td>
          <Link href={`/issue/${issue.id}`}>
            <tr>
              <td>{issue.title}</td>
              <td>{issue.status}</td>
              <td>{}</td>
            </tr>
          </Link>
        </td>
      ))}
      </table>
    </div>
    </>
  );
}
