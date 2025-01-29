import axios from 'axios';
import type { Post } from '../types/post';

const BASE_URL = 'http://localhost:2000/api';

export const getPosts = async (): Promise<Post[]> => {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data;
}

export const createPost = async (post: Post): Promise<Post> => {
    const response = await axios.post(`${BASE_URL}/posts`, post);
    return response.data;
}
