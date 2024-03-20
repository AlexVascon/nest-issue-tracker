import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { NextPage } from "next";
import CreateComment from "~/components/CreateComment";
import Comment from "~/components/Comment";
import { useUser } from "@clerk/nextjs";
import { CardContent, CardFooter, Card } from "src/components/ui/card";
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
import { Separator } from "~/components/ui/separator";
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
  const { data } = api.issue.getById.useQuery({ id: issueId });

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

  return (
    <div>
      <div>
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
          <div className="space-y-2">
            <div className="flex justify-end">
              {!edit && (
                <Button className="bg-red-400" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              {!edit && (
                <Button
                  className="ml-2.5 bg-blue-400"
                  onClick={() => setEdit(!edit)}
                >
                  Edit
                </Button>
              )}
              {edit && (
                <Button className="bg-red-400" onClick={() => setEdit(!edit)}>
                  Cancel
                </Button>
              )}
            </div>
            {!edit && <h1 className="text-3xl font-bold">{title}</h1>}
            {edit && (
              <Input
                value={title}
                id="title"
                placeholder="Enter the title"
                onChange={(e) => setTitle(e.target.value)}
              />
            )}
            <p className="text-sm font-medium uppercase leading-none tracking-wide text-gray-500">
              Issue # {id}
            </p>
          </div>
          <Card>
            <CardFooter className="pt-5">
              <p className="text-sm leading-none tracking-wide text-gray-500">
                {dayjs(created).fromNow()}
              </p>
            </CardFooter>
            <CardFooter className="flex-col items-start border-t">
              <h2 className="pt-2 text-lg font-bold">Description</h2>
              <Textarea
                disabled={!edit}
                className="min-h-[200px] resize-none border-none"
                id="description"
                value={description}
                placeholder="Enter the description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardFooter>
            <CardFooter className="border-t pt-2.5">
              <div className="grid grid-cols-2 items-center gap-4 text-sm">
                <div className="flex items-center justify-end gap-2 pt-2.5">
                  <span className="text-gray-500">Status</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {status === STATUS.OPEN ? (
                        <Button
                          className="w-[140px] bg-lime-300 text-center"
                          variant="outline"
                        >
                          Open
                        </Button>
                      ) : status === STATUS.IN_PROGRESS ? (
                        <Button
                          className="w-[140px] bg-yellow-300 text-center"
                          variant="outline"
                        >
                          In progress
                        </Button>
                      ) : (
                        <Button
                          className="w-[140px] bg-red-300 text-center"
                          variant="outline"
                        >
                          Closed
                        </Button>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[140px]">
                      <DropdownMenuItem onClick={() => setStatus(STATUS.OPEN)}>
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus(STATUS.IN_PROGRESS)}
                      >
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus(STATUS.CLOSED)}
                      >
                        Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardFooter>
            {edit && (
              <CardFooter className=" border-t">
                <div className="flex w-full justify-end pt-5">
                  <Button className="bg-purple-400" onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
          <CreateComment issueId={issueId} authorId={authorId ?? ""} />
          {issueComments &&
            issueComments.data?.map((comment) => (
              <Comment key={comment.comment.id} {...comment} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
