import { useState, FormEvent, useEffect } from "react";
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { NextPage } from "next";
import CreateComment from "~/components/CreateComment";
import Comment from "~/components/Comment";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

enum STATUS{
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS"
}

const IssuePage: NextPage = () => {
  const user = useUser();
  const authorId = user.user?.id;

  const router = useRouter();
  const issueId = Number(router.query.id);
  const { data }  = api.issue.getById.useQuery({ id: issueId });

  const updateIssue = api.issue.update.useMutation();
  const issueComments = api.comment.getIssueComments.useQuery({issueId});
  const deleteIssue = api.issue.delete.useMutation();

  const [edit, setEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<STATUS>(STATUS.OPEN);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setStatus(data.status as STATUS);
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateIssue.mutateAsync({id: issueId, title, description, status});
  }

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    await deleteIssue.mutateAsync({ issueId });
    setIsDeleted(true);
  }

  useEffect(() => {
    if(isDeleted) void router.push('/dashboard');
  }, [isDeleted]);

  return (
    <div className="page">
      <div className="back">
       <Link href="/dashboard">
        <button className="back-btn">Back</button>
      </Link>
      </div>
      <div className="btns">
        {!edit && <button id="delete-btn" onClick={handleDelete}>Delete</button>}
        {!edit && <button id="edit-btn" onClick={() => setEdit(!edit)}>Edit</button>}
        {edit && <button id="cancel-btn" onClick={() => setEdit(!edit)}>Cancel</button>}
      </div>
      <form id="edit-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input disabled={!edit} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Description</label>
        <textarea disabled={!edit} value={description} onChange={(e) => setDescription(e.target.value)}  />
        <select disabled={!edit} value={status} onChange={(e) => setStatus(e.target.value as STATUS)}>
          <option value={STATUS.OPEN}>OPEN</option>
          <option value={STATUS.IN_PROGRESS}>IN PROGRESS</option>
          <option value={STATUS.CLOSED}>CLOSED</option>
        </select>
        <div className="submit-btn-container">
        {edit && <button type="submit">Submit</button>}
        </div>
      </form>
      <div id="comments">
      <CreateComment issueId={issueId} authorId={authorId ?? ''} />
      {issueComments && issueComments.data?.map((comment) => (
        <Comment key={comment.comment.id} {...comment}/>
      ))}
    </div>
    </div>
  );
}

export default IssuePage;