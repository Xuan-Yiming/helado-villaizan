import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Post } from '@/app/lib/types';

import { load_posts } from '@/app/lib/database';
import PostCard from './post-card';

interface PostListProps {
    initialPosts: Post[];
    socialNetworkFilter: string;
    postTypeFilter: string;
    responseFilter: string;
    tagsFilter: string;
}

const NUMBER_OF_POSTS_TO_FETCH = 20;

export default function PostList({
    initialPosts,
    socialNetworkFilter,
    postTypeFilter,
    responseFilter,
    tagsFilter
}: PostListProps) {
    const [offset, setOffset] = useState(NUMBER_OF_POSTS_TO_FETCH);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const { ref, inView } = useInView();

    const loadMorePosts = async () => {
        try {
            const apiPosts = await load_posts(
                offset,
                offset / NUMBER_OF_POSTS_TO_FETCH + 1,
                socialNetworkFilter,
                postTypeFilter,
                responseFilter,
                tagsFilter
            );
            setPosts(posts => [...posts, ...apiPosts]);
            setOffset(offset => offset + NUMBER_OF_POSTS_TO_FETCH);
        } catch (error) {
            console.error('Error loading more posts:', error);
        }
    };

    useEffect(() => {
        if (inView) {
            loadMorePosts();
        }
    }, [inView]);

    return (
        <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
            <div ref={ref} className="flex justify-center mt-10">
                Loading...
            </div>
        </ul>
    );
}