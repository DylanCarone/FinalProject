import React from "react";
import { supabase } from "../client";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import DeleteConfirmation from "../components/deleteConfirmation";
import Comment from "../components/comment";

const PostDetails = ({ userID }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { postID } = useParams();
  const [newComment, setNewComment] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);


  useEffect(() => {
    fetchPost();
    fetchUpvotes();
  }, [postID, newComment]);

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteOpen = () => setIsDeleteOpen(true);
  const handleDeleteClose = () => setIsDeleteOpen(false);
  const handleChange = (event) => setNewComment(event.target.value);


  const handleDeleteConfirm = async () => {
    // delete the comments first
    const { error: errorDeletingComments } = await supabase
      .from("Comments")
      .delete()
      .eq("post_id", postID);

    if (errorDeletingComments) {
      console.error("Error deleting comments: ", errorDeletingComments);
      return;
    }

    // then delete the post
    const { error: errorDeletingPost } = await supabase
      .from("Posts")
      .delete()
      .eq("id", postID);

    if (errorDeletingPost) {
      console.error("Error deleting post: ", errorDeletingPost);
      return;
    }

    console.log("Post ", postID, " and its comments deleted!");

    setIsDeleteOpen(false);

    // alert("Post Deleted!");
    window.location = "/";
  }


  const fetchComments = async () => {
    const { data } = await supabase
      .from("Comments")
      .select()
      .eq("post_id", postID);

    setComments(data);
    // console.log("Comments:", data);
  };

  const fetchPost = async () => {
    const { data } = await supabase.from("Posts").select().eq("id", postID);
    setPost(data);
  };

  const fetchUpvotes = async () => {
    const { data } = await supabase
      .from("Posts")
      .select("upvotes")
      .eq("id", postID);

    setUpvoteCount(data[0].upvotes);
  };





  const addComment = async (event) => {
    event.preventDefault();

    const { error: updateError } = await supabase
      .from("Comments")
      .insert({ comment: newComment, post_id: postID, user_name: userID })

    if (updateError) {
      console.error("Error updating post:", updateError);
    } else {
      setNewComment(""); // Update this line
      fetchComments();
    }
  };

  const upvote = async (event) => {
    event.preventDefault();

    await supabase
      .from("Posts")
      .update({ upvotes: upvoteCount + 1 })
      .eq("id", postID);

    setUpvoteCount(upvoteCount + 1);
  };



  return (
    <div className="details-page">
      {post && post[0] && (
        <>
          <div className="details-content">
            <div className="details-header">
              <h3>{post[0].user_name}</h3>
              <h4>posted {moment(post[0].created_at).fromNow()}</h4>
            </div>
            <h1>{post[0].title}</h1>
            <h3>{post[0].content}</h3>
            {post[0].img_url && <img src={post[0].img_url} alt="post" />}

            <div className="details-buttons">
              <div className="upvote-section">
                <button className="upvote-button" onClick={upvote}>
                  <p>👍 {upvoteCount}</p>
                </button>

              </div>


              <div className="edit-section">
                <a href={`/edit/${postID}`}>

                  <button className="edit-button">Edit</button>
                </a>

                <button className="delete-button" onClick={handleDeleteOpen}>Delete</button>
                <DeleteConfirmation isOpen={isDeleteOpen} onClose={handleDeleteClose} onDelete={handleDeleteConfirm} secret={post[0].secret_key} />
              </div>

            </div>
          </div>

          <div className="details-comments">
            <div className="details-submit-comment">
              <textarea
                type="text"
                id="comment"
                name="comment"
                placeholder="Leave a comment..."
                value={newComment} // Update this line
                onChange={handleChange}
              />
              <button className="comment-button" onClick={addComment}>
                Post Comment
              </button>
            </div>

            <div>
              {/* Other parts of your component... */}
              {comments ? (
                comments.map((comment, index) => (
                  <div key={index}>
                    <ul className="comment-posts">
                      <Comment comment={comment} />
                    </ul>
                  </div>
                ))
              ) : (
                <p>Loading comments...</p>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
