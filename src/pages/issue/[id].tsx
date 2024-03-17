import { useState, FormEvent, useEffect } from "react";
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { NextPage } from "next";
import CreateComment from "~/components/CreateComment";
import Comment from "~/components/Comment";
import { useUser } from "@clerk/nextjs";

enum Status{
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS"
}

const IssuePage: NextPage = () => {
  const user = useUser();
  const authorId = user.user?.id;
  const router = useRouter()
  const { id } = router.query
  const issueId = Number(id);
  const { data }  = api.issue.getById.useQuery({ id: issueId });
  const updateIssue = api.issue.update.useMutation()
  const issueComments = api.comment.getIssueComments.useQuery({issueId})

  const [isDisabled, setIsDisabled] = useState(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.OPEN);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setStatus(data.status as Status);
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateIssue.mutateAsync({id: issueId, title, description, status});
  }


  return (
    <>
    <div id="create-page">
      <button onClick={() => setIsDisabled(!isDisabled)}>Edit</button>
      <form id="create-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input disabled={isDisabled} type="text" value={title} />
        <label>Description</label>
        <input disabled={isDisabled} type="text" id="description" value={description}  />
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value={Status.OPEN}>OPEN</option>
          <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
          <option value={Status.CLOSED}>CLOSED</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <div id="comments">
      <CreateComment issueId={issueId} authorId={authorId || ''} />
      {issueComments && issueComments.data?.map((comment) => (
        <Comment {...comment}/>
      ))}
    </div>
    </div>
    </>
  );
}

export default IssuePage;