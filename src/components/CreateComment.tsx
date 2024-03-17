import { useState, FormEvent, useEffect } from "react";
import {api } from "~/utils/api";

interface ICreateCommentProps {
  issueId: number;
  authorId: number;
}
const CreateComment = (props: ICreateCommentProps) => {
  const {issueId, authorId} = props;
  const [description, setDescription] = useState('')

  const createComment = api.comment.create.useMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createComment.mutateAsync({description, issueId, authorId});

  }
  return (
    <div id="create-comment">
      <label >Write comment</label>
     <input type="text" onChange={(e) => setDescription(e.target.value)}  />
     <button onClick={handleSubmit}>Post</button>
    </div>
  );
}

export default CreateComment;