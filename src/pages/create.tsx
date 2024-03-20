import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";
import type { NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

const Create: NextPage = () => {
  const user = useUser();
  const authorId = user.user?.id;
  const createIssue = api.issue.create.useMutation();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createIssue.mutateAsync({
      description,
      title,
      authorId: authorId ?? "",
    });
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubmitted) router.push("/dashboard", { scroll: false });
  }, [isSubmitted]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4">
      <div className="space-y-2 pt-6">
        <h1 className="text-3xl font-bold">New issue</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Create a new issue for this project. Please be as descriptive as
          possible.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter the title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            className="min-h-[200px] resize-none"
            id="description"
            placeholder="Enter the description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button size="lg" onClick={handleSubmit}>
          Submit new issue
        </Button>
      </div>
    </div>
  );
};

export default Create;
