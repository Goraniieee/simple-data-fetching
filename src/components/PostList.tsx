import { styled } from 'styled-components';

import type { Post } from '../types/Post';

const PostList = ({
  posts,
  selectedPostId,
  setSelectedPostId,
}: {
  posts: Post[];
  selectedPostId: number | undefined;
  setSelectedPostId: (id: number) => void;
}) => (
  <Wrapper>
    <Header>포스트 목록</Header>
    {posts.map((post, index) => (
      <TitleContainer
        key={index}
        isSelected={post.id === selectedPostId}
        onClick={() => {
          setSelectedPostId(post.id);
        }}
      >
        <strong>{index + 1}.</strong> <span>{post.title}</span>
      </TitleContainer>
    ))}
  </Wrapper>
);

export default PostList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const TitleContainer = styled.div<{ isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 96%;
  cursor: pointer;

  background-color: ${(props) =>
    props.isSelected ? '#d3d3d3' : 'transparent'};

  &:hover {
    span {
      color: grey;
    }
  }

  strong {
    margin-right: 0.5rem;
  }

  span {
    color: ${(props) => (props.isSelected ? 'black' : 'inherit')};
  }
`;
