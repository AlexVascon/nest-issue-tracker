import { useState, FormEvent } from "react";
import {api } from "~/utils/api";
import { useRouter } from "next/router";

interface ICreateCommentProps {
  issueId: number;
  authorId: string;
}
const CreateComment = (props: ICreateCommentProps) => {
  const router = useRouter();
  const {issueId, authorId} = props;
  const [description, setDescription] = useState<string>('');

  const createComment = api.comment.create.useMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createComment.mutateAsync({description, issueId, authorId});
    void router.reload();
  }

  return (
    <div id="create-comment">
      <label >Write comment</label>
     <input className="description" type="text" onChange={(e) => setDescription(e.target.value)}  />
     <div>
      <div className="btns">
     <button className="post" onClick={handleSubmit}>Post</button>
     </div>
     </div>
    </div>
  );
}

export default CreateComment;
