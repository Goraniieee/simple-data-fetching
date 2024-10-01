import { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';

import PostDetail from '../components/PostDetail';
import PostList from '../components/PostList';
import {
  FetchActionType,
  FetchStatus,
  statusReducer,
} from '../reducers/FetchStatusReducer';
import type { Post } from '../types/Post';

type StatusList = {
  postListStatus: FetchStatus;
};

const PostView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>();
  const [status, dispatch] = useReducer(
    statusReducer<StatusList, keyof StatusList>,
    { postListStatus: FetchStatus.LOADING },
  );

  useEffect(() => {
    let ignore = true;
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data: Post[]) => {
        if (!ignore) return;
        setPosts(data);
        dispatch({ type: FetchActionType.SUCCESS, key: 'postListStatus' });
      })
      .catch(() => {
        if (!ignore) return;
        setPosts([]);
        dispatch({ type: FetchActionType.ERROR, key: 'postListStatus' });
        // We won't implement the retry with backoff logic here, because it is only for assignment.
      });
    return () => {
      ignore = false;
    };
  }, []);

  return (
    <Wrapper>
      {status.postListStatus === FetchStatus.LOADING ? (
        <div>로딩 중...</div>
      ) : status.postListStatus === FetchStatus.ERROR ? (
        <div>데이터를 불러오는 중에 오류가 발생했습니다.</div>
      ) : (
        <>
          <PostList posts={posts} setSelectedPostId={setSelectedPostId} />
          {selectedPostId !== undefined && (
            <>
              <Divider />
              <PostDetail postId={selectedPostId} />
            </>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default PostView;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Divider = styled.div`
    width: 2px;
    background-color:
    height: 100vh;
`;
