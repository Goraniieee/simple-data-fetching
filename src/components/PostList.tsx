import { styled } from 'styled-components';

import type { Post } from '../types/Post';

const PostList = ({
  posts,
  setSelectedPostId,
}: {
  posts: Post[];
  setSelectedPostId: (id: number) => void;
}) => (
  <Wrapper>
    <Header>포스트 목록</Header>
    {posts.map((post, index) => (
      <div
        key={index}
        onClick={() => {
          setSelectedPostId(post.id);
        }}
      >
        <strong>{index + 1}.</strong> {post.title}
      </div>
    ))}
  </Wrapper>
);

export default PostList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;
