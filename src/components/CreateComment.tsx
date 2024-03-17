import { useState, FormEvent } from "react";
import {api } from "~/utils/api";

interface ICreateCommentProps {
  issueId: number;
  authorId: string;
}
const CreateComment = (props: ICreateCommentProps) => {
  const {issueId, authorId} = props;
  const [description, setDescription] = useState<string>('');

  const createComment = api.comment.create.useMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createComment.mutateAsync({description, issueId, authorId});
  }
  return (
    <div id="create-comment">
      <label >Write comment</label>
     <input className="description" type="text" onChange={(e) => setDescription(e.target.value)}  />
     <div>
     <button onClick={handleSubmit}>Post</button>
     </div>
    </div>
  );
}

export default CreateComment;
