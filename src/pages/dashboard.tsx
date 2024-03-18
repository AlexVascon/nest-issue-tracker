import Link from "next/link";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { Issue } from "@prisma/client";

enum FILTER{
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
  ALL = "ALL"
}

const Dashboard: NextPage = () => {
  const { data } = api.issue.getAll.useQuery();

  const [status, setStatus] = useState<FILTER>(FILTER.OPEN);
  const [issues, setIssues] = useState(data);
  const [filterList, setFilterList] = useState<Issue[]>();

  useEffect(() => {
    if(data) {
      setIssues(data);
      setFilterList(data);
    } 
  }, [data]);

  useEffect(() => {
    if(status === FILTER.ALL) {
      setFilterList(issues);
      return;
    }
    const filteredList = issues?.filter((issue) => issue.status === status);
    setFilterList(filteredList);
  }, [status, issues]);

  return (
    <div className="page">
      <div className='options'>
        <select value={status} onChange={(e) => setStatus(e.target.value as FILTER)}>
          <option value={'ALL'}>ALL</option>
          <option value={FILTER.OPEN}>OPEN</option>
          <option value={FILTER.IN_PROGRESS}>IN PROGRESS</option>
          <option value={FILTER.CLOSED}>CLOSED</option>
        </select>
        <Link href="/create">
        <button id="create-button">Create</button>
        </Link>
      </div>
    <table id="issues">
      <tr>
        <th>Issue</th>
        <th>Status</th>
        <th>Created</th>
      </tr>
      {filterList?.map((issue) => (
            <tr key={issue.id}>
                <td>
                  <Link 
                   href={`/issue/${issue.id}`}>
                  {issue.title}
                  </Link>
                </td>
              <td>
                {issue.status}
              </td>
              <td>
                {dayjs(issue.createdAt).format("DD/MM/YYYY")}
              </td>
            </tr>
      ))}
      </table>
    </div>
  );
}

export default Dashboard;
