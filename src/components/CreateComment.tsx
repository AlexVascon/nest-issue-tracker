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
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-2">
          <Label className="sm:translate-y-2" htmlFor="comment">
            <span>Your Comment</span>
          </Label>
          <Textarea
            className="min-h-[150px] resize-none"
            id="comment"
            placeholder="Enter your comment"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Post Comment</Button>
      </CardFooter>
    </Card>
  );
};

export default CreateComment;
