import Image from "next/image";
import { RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";
import { FormEvent, useEffect, useState } from "react";

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
    if(author.id === user?.id) setUserIsAuthor(true);
  }, [userIsAuthor])

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    await deleteComment.mutateAsync({
      commentId: comment.id,
      userId: user?.id || "",
      authorId: author.id,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateComment.mutateAsync({id: comment.id, description})
  }
  
  return (
    <div id="comments-list">
       <div className="card">
        <div className='img'>
        <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      </div>
      <div className="test">
         <div className="top">
            <h3>{author.username}</h3>
            <p>{dayjs(comment.createdAt).format("DD/MM/YYYY")}</p>
          </div>
        <textarea disabled={isEdit} onChange={(e) => setDescription(e.target.value)} value={comment.description}/>
        <div className="bottom">
        {userIsAuthor && <button onClick={() => setIsEdit(true)}>Edit</button>}
        {userIsAuthor && <button onClick={handleDelete}>Delete</button>}
        {isEdit && <button onClick={handleSubmit}>Submit</button>}
      </div>
      </div>
      </div>
    </div>
  );
}

export default Comment;
