import React, { useState, useEffect } from "react";
import PostFeed from "../components/postFeed";
import moment from "moment";
import { supabase } from "../client";
import tags from "../data/tags.json";

const HomeFeed = ({ searchQuery, userID }) => {
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState("created_at");
  const [selectedButton, setSelectedButton] = useState("date");

  const [tagFilter, setTagFilter] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [sortMethod]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("Posts")
      .select()
      .order(sortMethod, { ascending: false });

    setPosts(data);
    setLoading(false);
  };


  const handleClickOutside = (event) => {
    if (dropdownVisible && !event.target.closest(".tag-filter-container")) {
      setDropdownVisible(false);
    }
  };

  const handleTagSelection = (tagName) => {
    if (selectedTags.includes(tagName)) {
      removeTag(tagName);
    } else {
      addTag(tagName);
    }
  };

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const selectAllTags = () => {
    setSelectedTags(tags.map((tag) => tag.tagName));
  };

  const clearTags = () => {
    setSelectedTags([]);
  };
  const handleSearch = (event) => {
    setQuery(event.target.value);
    // setSearchQuery(event.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const titleMatch =
      post.title &&
      post.title.toLowerCase().includes(query.toLowerCase());
    const tagMatch =
      selectedTags.length === 0 ||
      (post.tags && selectedTags.some((tag) => post.tags.includes(tag)));

    return titleMatch && tagMatch;
  });

  return (
    <div className="feed-container">
      {loading ? (
        <img src="../public/loading.gif" alt="loading" className="loading-gif" />
      ) : (
        <>
          <SortingOptions
            selectedButton={sortMethod}
            setSortMethod={setSortMethod}
            dropdownVisible={dropdownVisible}
            setDropdownVisible={setDropdownVisible}
            selectedTags={selectedTags}
            handleTagSelection={handleTagSelection}
            removeTag={removeTag}
            selectAllTags={selectAllTags}
            clearTags={clearTags}
            searchQuery={query}
            handleSearch={handleSearch}
          />

          <PostList filteredPosts={filteredPosts} tagFilter={tagFilter} />
        </>
      )}
    </div>
  );
};

const SortingOptions = ({
  selectedButton,
  setSortMethod,
  dropdownVisible,
  setDropdownVisible,
  selectedTags,
  handleTagSelection,
  removeTag,
  selectAllTags,
  clearTags,
  searchQuery,
  handleSearch,

}) => {
  return (
    <div className="sorting-options">
      Sort by:
      <SortButton
        selectedButton={selectedButton}
        setSortMethod={setSortMethod}
        sortValue="created_at"
        label="Date"
      />
      <SortButton
        selectedButton={selectedButton}
        setSortMethod={setSortMethod}
        sortValue="upvotes"
        label="Upvotes"
      />
      <TagFilter
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        selectedTags={selectedTags}
        handleTagSelection={handleTagSelection}
        removeTag={removeTag}
        selectAllTags={selectAllTags}
        clearTags={clearTags}
      />
      <div>
        <input
          type="text"
          placeholder="Search"
          className="nav-search"
          value={searchQuery}
          onChange={handleSearch}
        />

      </div>
    </div>
  );
};

const SortButton = ({ selectedButton, setSortMethod, sortValue, label }) => {
  return (
    <button
      className={`sort-button ${selectedButton === sortValue ? "selected" : ""
        }`}
      onClick={() => {
        setSortMethod(sortValue);
      }}
    >
      {label}
    </button>
  );
};

const TagFilter = ({
  dropdownVisible,
  setDropdownVisible,
  selectedTags,
  handleTagSelection,
  removeTag,
  selectAllTags,
  clearTags,
}) => {
  return (
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
          <div>Filter by tag</div>
        )}

        <span className="dropdown-arrow">▼</span>
      </div>
      {dropdownVisible && (
        <Dropdown
          tags={tags}
          selectedTags={selectedTags}
          handleTagSelection={handleTagSelection}
          selectAllTags={selectAllTags}
          clearTags={clearTags}
        />
      )}
    </div>
  );
};

const Dropdown = ({
  tags,
  selectedTags,
  handleTagSelection,
  selectAllTags,
  clearTags,
}) => {
  return (
    <div className="dropdown">
      {tags.map((tag, index) => (
        <div
          className="dropdown-selections"
          key={index}
          style={{ backgroundColor: tag.backgroundColor, color: tag.textColor }}
          onClick={() => handleTagSelection(tag.tagName)}
        >
          <input
            type="checkbox"
            id={`tag-${index}`}
            checked={selectedTags.includes(tag.tagName)}
            readOnly
          />
          <label htmlFor={`tag-${index}`}>{tag.tagName}</label>
        </div>
      ))}
      <div className="dropdown-buttons">
        <button onClick={selectAllTags}>Select All ({tags.length})</button>
        <button onClick={clearTags}>Clear</button>
      </div>
    </div>
  );
};

const PostList = ({ filteredPosts, tagFilter }) => {
  return (
    <>
      {filteredPosts.length === 0 && <h1>No posts found</h1>}
      {filteredPosts
        .filter((post) => {
          const selectedTags = Object.keys(tagFilter).filter(
            (tagName) => tagFilter[tagName]
          );
          return (
            !selectedTags.length ||
            post.tags.some((tag) => selectedTags.includes(tag))
          );
        })
        .map((post, index) => (
          <PostFeed
            key={index}
            id={post.id}
            time={moment(post.created_at).fromNow()}
            title={post.title}
            upvoteCount={post.upvotes}
            userID={post.user_name}
            tags={post.tags}
            img_url={post.img_url}
          />
        ))}
    </>
  );
};

export default HomeFeed;
