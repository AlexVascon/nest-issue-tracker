import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import type { NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Priority } from "@prisma/client";
import LoadingSpinner from "~/components/LoadingSpinner";
import { api } from "~/utils/api";
import Image from "next/image";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Create: NextPage = () => {
  const { user } = useUser();
  const authorId = user?.id ?? "";
  const createIssue = api.issue.create.useMutation();
  const router = useRouter();

  const [title, setTile] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [username, setUsername] = useState("");
  const [assigned, setAssigned] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDataList, setShowDataList] = useState<boolean>(false);

  const { data } = api.user.assign.useQuery({
    username,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await createIssue.mutateAsync({
        description,
        title,
        priority,
        assigned,
        image,
        authorId,
      });

      router.push("/dashboard", { scroll: false });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignChange = (username: string, image: string) => {
    setAssigned(username);
    setImage(image);
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
              value={title}
              onChange={(e) => setTile(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {typeof window !== "undefined" && (
              <ReactQuill
                value={description}
                onChange={(value) => setDescription(value)}
              />
            )}
          </div>
          <div className="mt-2 flex items-center justify-between space-y-2">
            <span>Priority</span>
            <div>
              <input
                className="m-2 h-5 w-5 bg-blue-500 text-blue-500"
                type="radio"
                value={Priority.LOW}
                onChange={() => setPriority(Priority.LOW)}
              />
              <input
                type="radio"
                className="m-2 h-5 w-5 bg-purple-500 text-purple-500"
                value={Priority.MEDIUM}
                onChange={() => setPriority(Priority.MEDIUM)}
              />
              <input
                type="radio"
                className="m-2 h-5 w-5 bg-orange-500 text-orange-500"
                value={Priority.HIGH}
                onChange={() => setPriority(Priority.HIGH)}
              />
            </div>
          </div>
          <div className="relative mt-2 flex flex-row items-center justify-between">
            <div className="flex ">
              <span>Assign</span>
              {!assigned && (
                <span className="pl-2 text-gray-400">Unassigned</span>
              )}
              {assigned && (
                <div>
                  <Image
                    src={image ?? ""}
                    width={30}
                    height={30}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <span className="pl-2">{assigned}</span>
                </div>
              )}
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setShowDataList(true)}
              onBlur={() => setShowDataList(false)}
              className="search rounded-full  px-1 py-1"
            />
            {showDataList && (
              <ul className="search absolute top-full z-50 mt-1 w-full bg-white shadow-md">
                {data?.map((user) => (
                  <li
                    key={user.id}
                    className="flex flex-row px-4 py-2 hover:bg-gray-100"
                    onClick={() =>
                      handleAssignChange(user.username, user.img_url)
                    }
                  >
                    <Image
                      src={user.img_url ?? ""}
                      width={30}
                      height={30}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex w-full items-center">
            <Button size="lg" type="submit" className="mt-3 w-full">
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
