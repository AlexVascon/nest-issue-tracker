import Link from "next/link";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "src/components/ui/table";
import { Button } from "src/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "src/components/ui/dropdown-menu";
import { Badge } from "src/components/ui/badge";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import type { Issue } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
dayjs.extend(relativeTime);

enum FILTER {
  ALL = "ALL",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
}

const Dashboard: NextPage = () => {
  const { data } = api.issue.getAll.useQuery();
  const router = useRouter();

  const [status, setStatus] = useState<FILTER>(FILTER.ALL);
  const [issues, setIssues] = useState(data);
  const [filterList, setFilterList] = useState<Issue[]>();

  useEffect(() => {
    if (data) {
      setIssues(data);
      setFilterList(data);
    }
  }, [data]);

  useEffect(() => {
    if (status === FILTER.ALL) {
      setFilterList(issues);
      return;
    }
    const filteredList = issues?.filter((issue) => issue.status === status);
    setFilterList(filteredList);
  }, [status, issues]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center gap-4 px-4 lg:gap-8 lg:px-6">
          <div className="flex-1 font-semibold">Issues</div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[140px] justify-between" variant="outline">
                  {status}
                  <ChevronDownIcon className="h-4 w-4 -translate-y-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[140px]">
                <DropdownMenuItem onClick={() => setStatus(FILTER.OPEN)}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus(FILTER.IN_PROGRESS)}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus(FILTER.CLOSED)}>
                  Closed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus(FILTER.ALL)}>
                  All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link
            className="flex items-center gap-2 text-sm font-medium"
            href="/create"
          >
            <PlusIcon className="h-4 w-4" />
            Create
          </Link>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container flex flex-col gap-4 px-4 md:gap-8 lg:gap-12 lg:px-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterList?.map((issue) => (
                  <TableRow
                    key={issue.id}
                    onClick={() => router.push(`/issue/${issue.id}`)}
                  >
                    <TableCell className="font-semibold">
                      {issue.title}
                    </TableCell>
                    <TableCell>
                      {issue.status === "OPEN" && (
                        <Badge className={`bg-green-500`}>{issue.status}</Badge>
                      )}
                      {issue.status === "IN_PROGRESS" && (
                        <Badge className={`bg-yellow-500`}>
                          {issue.status}
                        </Badge>
                      )}
                      {issue.status === "CLOSED" && (
                        <Badge className={`bg-red-500`}>{issue.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{dayjs(issue.createdAt).fromNow()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

function PlusIcon(props: Record<string, unknown>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ChevronDownIcon(props: Record<string, unknown>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default Dashboard;
