import { useUser } from "@clerk/nextjs";
import Link from 'next/link'
import dayjs from "dayjs";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

enum Status{
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
  ALL = "ALL"
}

export default function Dashboard() {
  const { data } = api.issue.getAll.useQuery();

  const [status, setStatus] = useState(Status.OPEN);
  const [issues, setIssues] = useState(data);
  const [filterList, setFilterList] = useState(issues);

  useEffect(() => {
    if(data) setIssues(data);
  }, data)

  useEffect(() => {
    if(status === "ALL") {
      setFilterList(issues);
      return;
    }
    const filteredList = issues?.filter((issue) => issue.status === status);
    setFilterList(filteredList);
  }, [status])


  return (
    <div>
      <div className='status'>
      <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value={'ALL'}>ALL</option>
          <option value={Status.OPEN}>OPEN</option>
          <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
          <option value={Status.CLOSED}>CLOSED</option>
        </select>
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
      {filterList?.map((issue) => (
         
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
