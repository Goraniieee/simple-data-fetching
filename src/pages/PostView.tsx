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
    let ignore = false;
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data: Post[]) => {
        if (ignore) return;
        setPosts(data);
        dispatch({ type: FetchActionType.SUCCESS, key: 'postListStatus' });
      })
      .catch(() => {
        if (ignore) return;
        setPosts([]);
        dispatch({ type: FetchActionType.ERROR, key: 'postListStatus' });
        // We won't implement the retry with backoff logic here, because it is only for assignment.
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setSelectedPostId(posts[0]?.id);
  }, [posts]);

  return (
    <Wrapper>
      {status.postListStatus === FetchStatus.LOADING ? (
        <div>로딩 중...</div>
      ) : status.postListStatus === FetchStatus.ERROR ? (
        <div>데이터를 불러오는 중에 오류가 발생했습니다.</div>
      ) : (
        <>
          <LeftSection>
            <PostList posts={posts} selectedPostId={selectedPostId} setSelectedPostId={setSelectedPostId} />
          </LeftSection>
          <Divider />
          <RightSection>
            {selectedPostId !== undefined && <PostDetail postId={selectedPostId} />}
          </RightSection>
        </>
      )}
    </Wrapper>
  );
};

export default PostView;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100vh;
  padding: 1rem;
`;

const LeftSection = styled.div`
  width: 48%;
  height: 100%;
`;

const RightSection = styled.div`
  width: 48%;
  height: 100%;
`;

const Divider = styled.div`
  width: 2px;
  background-color: rgba(128, 128, 128, 0.3);
  height: 96vh;
`;
