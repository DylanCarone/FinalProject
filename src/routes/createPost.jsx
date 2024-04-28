import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import tags from "../data/tags.json";

const CreatePost = ({ userID }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [secret, setSecret] = useState("");

  const [tagFilter, setTagFilter] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


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
    setSecret(e.target.value);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const validSize = 5000000; // 5MB
  
    if (file && validTypes.includes(file.type) && file.size <= validSize) {
      setSelectedFile(file);
    } else {
      alert('Invalid file. Only jpeg, png, and gif files under 5MB are allowed.');
      event.target.value = '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownVisible && !event.target.closest(".tag-filter-container")) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleTagSelection = (tagName) => {
    if (selectedTags.includes(tagName)) {
      removeTag(tagName);
    } else {
      addTag(tagName);
    }
  };

  const selectAllTags = () => {
    setSelectedTags(tags.map((tag) => tag.tagName));
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const uploadImage = async () => {

  }
  const createPost = async (event) => {
    event.preventDefault();

    let imgUrl = null;
    
    if (selectedFile) {
      const code = Math.floor(1000 + Math.random() * 9000);
      const { data, error } = await supabase.storage
        .from("Images")
        .upload(`public/${code + "_" + selectedFile.name}`, selectedFile);        

      if (error) {
        console.log("Error uploading file: ", error.message);
      }
      else{               
        imgUrl = `https://qhhydklqgbczyscwdwjl.supabase.co/storage/v1/object/public/Images/${data.path}`; 
      }
    }

    await supabase
      .from("Posts")
      .insert([
        {
          title: title,
          content: content,
          img_url: imgUrl,
          upvotes: 0,
          user_name: userID,
          secret_key: secret,
          tags: selectedTags,
        },
      ])
      .select();

    window.location = "/";
  };

  

  const uploadPost = () => {
    createPost();
    uploadImage();

  }

  return (
    <div className="create-post-page">
      <h1>Create a New Post</h1>
      <form onSubmit={createPost}>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="create-input"
          placeholder="Title"
          required={true}
        />
        <div className="tag-filter-container">
          <div
            className="tag-filter"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            {selectedTags.length > 0 ? (
              selectedTags.map((selectedTag, index) => {
                const tag = tags.find((tag) => tag.tagName === selectedTag);
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: tag?.backgroundColor,
                      color: tag?.textColor,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(selectedTag);
                    }}
                    className="selected-tag"
                  >
                    {selectedTag}
                  </div>
                );
              })
            ) : (
              <div>Set tag (optional)</div>
            )}

            <span className="dropdown-arrow">▼</span>
          </div>

          {dropdownVisible && (
            <div className="dropdown">
              {tags.map((tag, index) => (
                <div
                  className="dropdown-selections"
                  key={index}
                  style={{
                    backgroundColor: tag.backgroundColor,
                    color: tag.textColor,
                  }}
                  onClick={() => handleTagSelection(tag.tagName)}
                >
                  <input
                    type="checkbox"
                    id={`tag-${index}`}
                    checked={selectedTags.includes(tag.tagName)}
                    readOnly
                  />
                  <label
                    htmlFor={`tag-${index}`}
                    onClick={() => addTag(tag.tagName)}
                  >
                    {tag.tagName}
                  </label>
                </div>
              ))}
              <div className="dropdown-buttons">
                <button onClick={selectAllTags}>
                  Select All ({tags.length})
                </button>
                <button onClick={clearTags}>Clear</button>
              </div>
            </div>
          )}
        </div>

        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          className="content-input"
          placeholder="Write your post here... (Optional)"
        ></textarea>

        <input
          type="text"
          id="imgUrl"
          value={imgUrl}
          onChange={handleURLChange}
          className="create-input"
          placeholder="Image URL (Optional)"
        />
        <input
          type="file"
          id="imgUpload"
          onChange={handleFileChange}
          className="create-input"
        />

        <input
          type="text"
          id="secret"
          value={secret}
          onChange={handleSecretChange}
          className="create-input"
          placeholder="Secret Key (Optional)"
        />

        <button className="create-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
