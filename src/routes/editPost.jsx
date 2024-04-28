import React from "react";
import { supabase } from "../client";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
// import { supabase } from "../client";

const EditPost = () => {
    const { postID } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const [post, setPost] = useState(null);

    const [secret, setSecret] = useState(null);
    const [secretKey, setSecretKey] = useState('');


    const updatePost = async (event) => {
        event.preventDefault();

        await supabase
            .from("Posts")
            .update([
                { title: title, content: content, img_url: imgUrl },
            ])
            .eq("id", postID);

        window.location = `/details/${postID}`;
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };
    const handleURLChange = (e) => {
        setImgUrl(e.target.value);
    };

    const handleSecretChange = (e) => {
        setSecretKey(e.target.value);
      };


    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase.from("Posts").select().eq("id", postID);
            setPost(data);
            if (data && data[0]) {
                setTitle(data[0].title);
                setContent(data[0].content);
                setImgUrl(data[0].img_url);
                setSecret(data[0].secret_key);
            }
        };


        fetchPost();

    }, [postID]);



    return (
        <div className="create-post-page">
            <h1>Edit Post</h1>
            <form onSubmit={updatePost}>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    className="create-input"
                    placeholder="Title"
                    required={true}
                />

                <textarea
                    id="content"
                    value={content}
                    onChange={handleContentChange}
                    className="content-input"
                    placeholder="Write your post here..."
                ></textarea>

                <input
                    type="text"
                    id="imgUrl"
                    value={imgUrl}
                    onChange={handleURLChange}
                    className="create-input"
                    placeholder="Image URL"
                />
                {secret ? (
                <input
                    type="text"
                    id="secret"
                    value={secretKey}
                    onChange={handleSecretChange}
                    className="create-input"
                    placeholder="Secret Key (required to edit post)"
                    required={true}
                />): <></>}

                {secret == secretKey ? <button className="create-button" type="submit">Submit</button> : <button className="create-button locked" type="submit" disabled>Submit</button>}
                
            </form>
        </div>
    );
};

export default EditPost;