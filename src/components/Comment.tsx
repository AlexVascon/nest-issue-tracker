import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "src/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Textarea } from "./ui/textarea";
dayjs.extend(relativeTime);

type CommentWithUser = RouterOutputs["comment"]["getIssueComments"][number];
const Comment = (props: CommentWithUser) => {
  const { comment, author } = props;
  const { user } = useUser();
  const deleteComment = api.comment.delete.useMutation();
  const updateComment = api.comment.update.useMutation();

  const [userIsAuthor, setUserIsAuthor] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(comment.description);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (author.id === user?.id) setUserIsAuthor(true);
  }, [userIsAuthor]);

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    await deleteComment.mutateAsync({
      commentId: comment.id,
      userId: user?.id ?? "",
      authorId: author.id,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateComment.mutateAsync({ id: comment.id, description });
  };

  return (
    <div className="grid gap-8">
      <div className="flex items-start gap-5">
        <Avatar className="mt-1.5 h-11 w-11 border">
          <AvatarImage alt="@shadcn" src={author.profileImageUrl} />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="grid w-full gap-1.5">
          <div className="flex items-center gap-3">
            <div className="font-semibold">{author.username}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {dayjs(comment.createdAt).fromNow()}
            </div>
          </div>
          <Textarea
            disabled={!isEdit}
            className="min-h-[50px] resize-none border-none"
            id="description"
            value={description}
            placeholder="Enter the description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center gap-2 text-xs">
            {userIsAuthor && (
              <button
                className="text-gray-500 underline"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
            {userIsAuthor && (
              <button
                className="text-gray-500 underline"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            {isEdit && (
              <button
                className="text-gray-500 underline"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
            {isEdit && (
              <button
                className="text-gray-500 underline"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
