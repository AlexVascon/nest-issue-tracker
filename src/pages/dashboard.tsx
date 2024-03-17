import Link from "next/link";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { NextPage } from "next";

enum STATUS{
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
  ALL = "ALL"
}

const Dashboard: NextPage = () => {
  const { data } = api.issue.getAll.useQuery();

  const [status, setStatus] = useState(STATUS.OPEN);
  const [issues, setIssues] = useState(data);
  const [filterList, setFilterList] = useState(issues);

  useEffect(() => {
    if(data) {
      setIssues(data);
      setFilterList(issues);
    } 
  }, [data]);

  useEffect(() => {
    if(status === "ALL") {
      setFilterList(issues);
      return;
    }
    const filteredList = issues?.filter((issue) => issue.status === status);
    setFilterList(filteredList);
  }, [status]);

  return (
    <div id="dashboard-page">
      <div className='options'>
        <select value={status} onChange={(e) => setStatus(e.target.value as STATUS)}>
          <option value={'ALL'}>ALL</option>
          <option value={STATUS.OPEN}>OPEN</option>
          <option value={STATUS.IN_PROGRESS}>IN PROGRESS</option>
          <option value={STATUS.CLOSED}>CLOSED</option>
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
            <tr>
              <td>
                <Link 
                href={`/issue/${issue.id}`}>
                {issue.title}
                </Link>
                </td>
              <td>{issue.status}</td>
              <td>{dayjs(issue.createdAt).format("DD/MM/YYYY")}</td>
            </tr>
      ))}
      </table>
    </div>
  );
}

export default Dashboard;
