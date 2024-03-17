import { useUser } from "@clerk/nextjs";
import Link from 'next/link'
import dayjs from "dayjs";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data } = api.issue.getAll.useQuery();

  return (
    <div>
      <div className='status'>
        <Link href="/create">
        <button id="create">Create</button>
        </Link>
      </div>
    <table id="issues">
      <tr>
        <th>Issue</th>
        <th>Status</th>
        <th>Created</th>
      </tr>
      {data?.map((issue) => (
         
            <tr>
              <td>
                <Link 
                href={`/issue/${issue.id}`}>
                {issue.title}
                </Link>
                </td>
             
              <td>{issue.status}</td>
              <td>{dayjs(issue.createdAt).date()}</td>
            </tr>

      ))}
      </table>
    </div>
  );
}
