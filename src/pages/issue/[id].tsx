import { useState, FormEvent, useEffect } from "react";
import { useRouter } from 'next/router'

import { api } from "~/utils/api";

export default function Dashboard() {
  const router = useRouter()
  const issueID = Number(router.query.id)
  const { data }  = api.issue.getById.useQuery({ id: issueID});

  return (
    <>
    <div id="create-page">
      <form id="create-form">
        <label>Title</label>
        <input disabled type="text" value={data?.title} />
        <label>Description</label>
        <input disabled type="text" id="description" value={data?.description}  />
        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
}
