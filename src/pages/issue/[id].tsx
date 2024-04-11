import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { NextPage } from "next";
import CreateComment from "~/components/CreateComment";
import Comment from "~/components/Comment";
import { useUser } from "@clerk/nextjs";
import { CardFooter, Card } from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "src/components/ui/dropdown-menu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner from "~/components/LoadingSpinner"; // Import your loading spinner component here
import { Badge } from "~/components/ui/badge";
dayjs.extend(relativeTime);

enum STATUS {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
}

const IssuePage: NextPage = () => {
  const user = useUser();
  const authorId = user.user?.id;

  const router = useRouter();
  const issueId = Number(router.query.id);
  const { data, isLoading } = api.issue.getById.useQuery({ id: issueId }); // Track loading state

  const updateIssue = api.issue.update.useMutation();
  const issueComments = api.comment.getIssueComments.useQuery({ issueId });
  const deleteIssue = api.issue.delete.useMutation();

  const [edit, setEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<STATUS>(STATUS.OPEN);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [id, setID] = useState<number>();
  const [created, setCreated] = useState<Date>();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setStatus(data.status as STATUS);
      setID(data.id);
      setCreated(data.createdAt);
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateIssue.mutateAsync({ id: issueId, title, description, status });
    router.reload();
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    await deleteIssue.mutateAsync({ issueId });
    setIsDeleted(true);
  };

  useEffect(() => {
    if (isDeleted) void router.push("/dashboard");
  }, [isDeleted]);

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

  return (
    <div className="mx-auto mb-20 max-w-2xl space-y-4 px-2 py-2">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-end space-x-2 py-2">
            {!edit && <Button onClick={handleDelete}>Delete</Button>}
            {!edit && (
              <Button variant="outline" onClick={() => setEdit(!edit)}>
                Edit
              </Button>
            )}
            {edit && <Button onClick={() => setEdit(!edit)}>Cancel</Button>}
          </div>
          <span className="flex justify-between py-1">
            <p className=" text-sm leading-none tracking-wide text-gray-500">
              Created {dayjs(created).fromNow()}
            </p>
            <p className="py-0 text-sm leading-none tracking-wide text-gray-500">
              {dayjs(created).format("DD/MM/YYYY")}
            </p>
          </span>
          <Card className="shadow-md shadow-stone-200">
            <CardFooter className="py-2">
              {!edit ? (
                <h1 className="py-0 text-3xl font-bold">{title}</h1>
              ) : (
                <Input
                  value={title}
                  id="title"
                  placeholder="Enter the title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-none border-input bg-transparent px-3 py-2 text-sm ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent"
                />
              )}
            </CardFooter>
            <CardFooter className="flex-col items-center border-t">
              <Textarea
                disabled={!edit}
                className="min-h-[200px] resize-none border-none border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent"
                id="description"
                value={description}
                placeholder="Enter the description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardFooter>
            <CardFooter className="justify-between border-t py-2">
              <div className="flex w-full items-center justify-between">
                <span className="text-gray-500">Status</span>
                {!edit && (
                  <Badge className={`${getBadgeColor(status)} text-center`}>
                    {status}
                  </Badge>
                )}
                {edit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="w-[140px] justify-between"
                        variant="outline"
                      >
                        {status}
                        <ChevronDownIcon className="h-4 w-4 -translate-y-0.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[140px]">
                      {Object.values(STATUS).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setStatus(status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardFooter>
            {edit && (
              <CardFooter className="items-center justify-end border-t py-2">
                <Button className="w-full" onClick={handleSubmit}>
                  Submit
                </Button>
              </CardFooter>
            )}
          </Card>
          <CreateComment issueId={issueId} authorId={authorId ?? ""} />
          {issueComments &&
            issueComments.data?.map((comment) => (
              <Comment key={comment.comment.id} {...comment} />
            ))}
        </>
      )}
    </div>
  );
};

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

export default IssuePage;
