import { useState, FormEvent, useEffect } from "react";
import { useRouter } from 'next/router'

import { api } from "~/utils/api";
import { NextPage } from "next";

enum Status{
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS"
}

const IssuePage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const issueId = Number(id);
  const [isDisabled, setIsDisabled] = useState(true);
  const { data }  = api.issue.getById.useQuery({ id: issueId });
  const updateIssue = api.issue.update.useMutation()

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
    </div>
    </>
  );
}

export default IssuePage;