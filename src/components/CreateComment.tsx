import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CardContent, CardFooter, Card } from "src/components/ui/card";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface ICreateCommentProps {
  issueId: number;
  authorId: string;
}
const CreateComment = (props: ICreateCommentProps) => {
  const router = useRouter();
  const { issueId, authorId } = props;
  const [description, setDescription] = useState<string>("");

  const createComment = api.comment.create.useMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createComment.mutateAsync({ description, issueId, authorId });
    void router.reload();
  };

  return (
    <Card className="shadow-md shadow-stone-200">
      <CardFooter className="items-center py-2">
        <span>Write Comment</span>
      </CardFooter>
      <CardFooter className="m-0 items-center border-t p-0">
        <ReactQuill
          id="comment"
          placeholder="Enter your comment"
          value={description}
          onChange={(value) => setDescription(value)}
        />
      </CardFooter>
      <CardContent className="space-y-4"></CardContent>
      <CardFooter className="items-center justify-end border-t py-2">
        <Button onClick={handleSubmit}>Post Comment</Button>
      </CardFooter>
    </Card>
  );
};

export default CreateComment;
