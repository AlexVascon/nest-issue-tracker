import { useState, FormEvent, useEffect } from "react";
import { useRouter } from 'next/router'

import { api } from "~/utils/api";

export default function Dashboard() {
  const router = useRouter()
  const issueID = Number(router.query.id)
  const [isDisabled, setIsDisabled] = useState(true);
  const { data }  = api.issue.getById.useQuery({ id: issueID});

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setStatus(data.status || '');
    }
  }, [data]);


  return (
    <>
    <div id="create-page">
      <button onClick={() => setIsDisabled(!isDisabled)}>Edit</button>
      <form id="create-form">
        <label>Title</label>
        <input disabled={isDisabled} type="text" value={title} />
        <label>Description</label>
        <input disabled={isDisabled} type="text" id="description" value={description}  />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
}
