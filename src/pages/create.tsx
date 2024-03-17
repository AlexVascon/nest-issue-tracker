import { useState, FormEvent, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

export default function Create() {
  const user = useUser();
  const authorId = user.user?.id;
  const createIssue = api.issue.create.useMutation();
  const router = useRouter()

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await createIssue.mutateAsync({description, title, authorId: authorId || ''});
    setIsSubmitted(true);
  }

  useEffect(() => {
    if(isSubmitted) router.push('/dashboard', { scroll: false });
  }, [isSubmitted]);

  return (
    <div id="create-page">
      <form id="create-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" onChange={(e) => setTitle(e.target.value)} />
        <label>Description</label>
        <input type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
        <div className="submit-button">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
