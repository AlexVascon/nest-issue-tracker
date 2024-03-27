import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CardContent, CardFooter, Card } from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";

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
      <CardFooter className="items-center border-t py-2">
        <Textarea
          className="min-h-[150px] resize-none border-none border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent disabled:opacity-0"
          id="comment"
          placeholder="Enter your comment"
          onChange={(e) => setDescription(e.target.value)}
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
