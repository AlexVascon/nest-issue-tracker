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
import LoadingSpinner from "~/components/LoadingSpinner";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
dayjs.extend(relativeTime);

enum FILTER {
  ALL = "ALL",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
}

const Dashboard: NextPage = () => {
  const { data, isLoading } = api.issue.getAll.useQuery();
  const router = useRouter();

  const [status, setStatus] = useState<FILTER>(FILTER.ALL);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filterList, setFilterList] = useState<Issue[]>([]);

  useEffect(() => {
    if (data) {
      setIssues(data);
      setFilterList(data);
    }
  }, [data]);

  useEffect(() => {
    if (status === FILTER.ALL) {
      setFilterList(issues);
    } else {
      const filteredList = issues?.filter((issue) => issue.status === status);
      setFilterList(filteredList);
    }
  }, [status, issues]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-400";
      case "IN_PROGRESS":
        return "bg-yellow-400";
      case "CLOSED":
        return "bg-red-400";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-blue-400";
      case "MEDIUM":
        return "bg-purple-400";
      case "HIGH":
        return "bg-orange-400";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {isLoading && <LoadingSpinner />}
      <header>
        <div className="container flex h-14 items-center justify-end gap-4 px-4 pt-6 lg:gap-8 lg:px-6">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[140px] justify-between" variant="outline">
                  {status}
                  <ChevronDownIcon className="h-4 w-4 -translate-y-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[140px]">
                {Object.values(FILTER).map((filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => setStatus(filter as FILTER)}
                  >
                    {filter}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4" />
            Create
          </Link>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="rounded-lg border shadow-md shadow-stone-200">
            <Table>
              <TableHeader>
                <TableRow className="shadow-md shadow-stone-200">
                  <TableHead className="w-3/5">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterList.map((issue) => (
                  <TableRow
                    key={issue.id}
                    onClick={() => router.push(`/issue/${issue.id}`)}
                  >
                    <TableCell className="font-semibold">
                      {issue.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getBadgeColor(issue.status)}  text-center`}
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getPriorityColor(issue.priority)} rounded-full p-2.5`}
                      ></Badge>
                    </TableCell>
                    <TableCell>{dayjs(issue.createdAt).fromNow()}</TableCell>
                    <TableCell className="flex items-center">
                      <Image
                        src={issue.assignedImage ?? ""}
                        width={10}
                        height={10}
                        alt="Avatar"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="pl-3">{issue.assignedUsername}</p>
                    </TableCell>
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
