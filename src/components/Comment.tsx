import Image from "next/image";
import { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";

type CommentWithUser = RouterOutputs["comment"]["getIssueComments"][number];
const Comment = (props: CommentWithUser) => {
  const { comment, author } = props;
  return (
    <div id="comments-list">
       <div className="card">
        <div className='img'>
        <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      </div>
      <div className="test">
      <div className="top">
        <h3>{author.username}</h3>
        <p>{dayjs(comment.createdAt).format("DD/MM/YYYY")}</p>
      </div>
        <p>{comment.description}</p>
      </div>
      </div>
    </div>
  );
}

export default Comment;
