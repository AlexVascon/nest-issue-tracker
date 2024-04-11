import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";
import type { NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Priority } from "@prisma/client";
import LoadingSpinner from "~/components/LoadingSpinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { api } from "~/utils/api";

const Create: NextPage = () => {
  const { user } = useUser();
  const authorId = user?.id ?? "";
  const createIssue = api.issue.create.useMutation();
  const router = useRouter();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [title, setTile] = useState<string>("");
  const [description, setDescriptipon] = useState<string>("");
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createIssue.mutateAsync({
        description: formData.description,
        title: formData.title,
        authorId,
      });

      router.push("/dashboard", { scroll: false });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter the title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="min-h-[200px] resize-none"
              id="description"
              name="description"
              placeholder="Enter the description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between space-y-2">
            <span>Priority</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[140px] justify-between" variant="outline">
                  {priority}
                  <ChevronDownIcon className="h-4 w-4 -translate-y-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[140px]">
                {Object.values(Priority).map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => setPriority(priority as Priority)}
                  >
                    {priority}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center justify-end">
            <Button size="lg" type="submit" className="mt-3">
              Submit new issue
            </Button>
          </div>
          {isSubmitting && <LoadingSpinner />}
        </form>
      </div>
    </div>
  );
};

export default Create;
