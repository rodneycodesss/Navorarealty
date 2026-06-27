import axios from "axios";
const API_URL = "https://jsonplaceholder.typicode.com/posts";
export const getPosts = () => axios.get(API_URL);
export const getPost = (id) => axios.get(`${API_URL}/${id}`);
export const createPost = (post) => axios.post(API_URL, post);
export const updatePost = (id, updatedPost) => axios.put(`${API_URL}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${API_URL}/${id}`);