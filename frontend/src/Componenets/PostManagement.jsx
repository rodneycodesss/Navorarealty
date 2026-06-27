import { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost } from
"../api/PostsApi";
const PostList = () => {
const [posts, setPosts] = useState([]);
const [newPost, setNewPost] = useState({ title: "", body: "" });
const [editingPost, setEditingPost] = useState(null);
// Fetch all posts
useEffect(() => {
getPosts()
.then((response) => setPosts(response.data))
.catch((error) => console.error("Error fetching posts:", error));
}, []);
// Create a new post
const handleCreate = async () => {
if (!newPost.title || !newPost.body) return;
try {
const response = await createPost(newPost);
setPosts([response.data, ...posts]); // Add new post to list
setNewPost({ title: "", body: "" }); // Reset input fields
} catch (error) {
console.error("Error creating post:", error);
}
};
// Update an existing post
const handleUpdate = async () => {
if (!editingPost.title || !editingPost.body) return;
try {
await updatePost(editingPost.id, editingPost);
setPosts(posts.map((post) => (post.id === editingPost.id ? editingPost :
post)));
setEditingPost(null); // Reset editing state
} catch (error) {
console.error("Error updating post:", error);
}
};
// Delete a post
const handleDelete = async (id) => {
try {
await deletePost(id);
setPosts(posts.filter((post) => post.id !== id));
} catch (error) {
console.error("Error deleting post:", error);
}
};
return (
<div>
<h2>Posts</h2>
{/* Create Post Form */}
<div>
<input
type="text"
placeholder="Title"
value={newPost.title}
onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
/>
<textarea
placeholder="Body"
value={newPost.body}
onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
/>
<button onClick={handleCreate}>Create Post</button>
</div>
{/* Post List */}
<ul>
{posts.map((post) => (
<li key={post.id}>
<h3>{post.title}</h3>
<p>{post.body}</p>
<button onClick={() => setEditingPost(post)}>Edit</button>
<button onClick={() => handleDelete(post.id)}>Delete</button>
</li>
))}
</ul>
{/* Edit Post Form */}
{editingPost && (
<div>
<h3>Edit Post</h3>
<input
type="text"
value={editingPost.title}
onChange={(e) => setEditingPost({ ...editingPost, title:
e.target.value })}
/>
<textarea
value={editingPost.body}
onChange={(e) => setEditingPost({ ...editingPost, body:
e.target.value })}
/>
<button onClick={handleUpdate}>Update Post</button>
</div>
)}
</div>
);
};
export default PostList;