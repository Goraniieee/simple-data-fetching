import { useEffect, useReducer, useState } from 'react';
import { styled } from 'styled-components';

import {
  FetchActionType,
  FetchStatus,
  statusReducer,
} from '../reducers/FetchStatusReducer';
import type { Comment } from '../types/Comment';
import type { Post } from '../types/Post';

type StatusList = {
  postStatus: FetchStatus;
  commentsStatus: FetchStatus;
};

const PostDetail = ({ postId }: { postId: number }) => {
  const [post, setPost] = useState<Post | undefined>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, dispatch] = useReducer(
    statusReducer<StatusList, keyof StatusList>,
    { postStatus: FetchStatus.LOADING, commentsStatus: FetchStatus.LOADING },
  );

  useEffect(() => {
    let ignore = false;

    dispatch({ type: FetchActionType.LOADING, key: 'postStatus' });
    dispatch({ type: FetchActionType.LOADING, key: 'commentsStatus' });

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => response.json())
      .then((data: Post) => {
        if (ignore) return;
        setPost(data);
        dispatch({ type: FetchActionType.SUCCESS, key: 'postStatus' });
      })
      .catch(() => {
        if (ignore) return;
        setPost(undefined);
        dispatch({ type: FetchActionType.ERROR, key: 'postStatus' });
        // We won't implement the retry with backoff logic here, because it is only for assignment.
      });

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data: Comment[]) => {
        if (ignore) return;
        setComments(data);
        dispatch({ type: FetchActionType.SUCCESS, key: 'commentsStatus' });
      })
      .catch(() => {
        if (ignore) return;
        setComments([]);
        dispatch({ type: FetchActionType.ERROR, key: 'commentsStatus' });
        // We won't implement the retry with backoff logic here, because it is only for assignment.
      });

    return () => {
      ignore = true;
    };
  }, [postId]);

  return (
    <Wrapper>
      <Header>내용</Header>
      {status.postStatus === FetchStatus.LOADING ? (
        <div>로딩 중...</div>
      ) : status.postStatus === FetchStatus.ERROR ? (
        <div>데이터를 불러오는 중에 오류가 발생했습니다.</div>
      ) : (
        <div>{post?.body}</div>
      )}
      <Header>댓글</Header>
      {status.commentsStatus === FetchStatus.LOADING ? (
        <div>로딩 중...</div>
      ) : status.commentsStatus === FetchStatus.ERROR ? (
        <div>데이터를 불러오는 중에 오류가 발생했습니다.</div>
      ) : (
        comments.map((comment: Comment, index: number) => (
          <CommentContainer key={index}>
            <CommentAuthor>작성자: {comment.email}</CommentAuthor>
            <CommentBody>{comment.body}</CommentBody>
          </CommentContainer>
        ))
      )}
    </Wrapper>
  );
};

export default PostDetail;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 0.5rem;
`;

const CommentContainer = styled.div`
  align-self: flex-start;
  margin-bottom: 1.5rem;
`;

const CommentAuthor = styled.h4`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CommentBody = styled.div`
  font-size: 1rem;
`;
