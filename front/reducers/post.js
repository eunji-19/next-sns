/**
 * 대문자와 소문자 차이(User, content)
 * - DB Sequlize와 연관되어 있음
 * - Sequlize에서 어떤 정보와 다른 정보가 관계가 있으면 합쳐줌 -> 대문자가 되어서 나타남
 * - id, content : 게시글 자체의 속성
 * - User, Images, Comments : 다른 정보들과 합쳐서 줌 (대문자)
 */
import shortId from "shortid";
import produce from "immer";
import faker from "@faker-js/faker";

export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "Jin",
      },
      content: "첫번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          id: shortId.generate(),
          src: "https://img1.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202108/25/starnews/20210825072239576oxwf.jpg",
        },
        {
          id: shortId.generate(),
          src: "https://thumb.mtstarnews.com/06/2022/01/2022011507103964279_1.jpg/dims/optimize",
        },
        {
          id: shortId.generate(),
          src: "http://file3.instiz.net/data/cached_img/upload/2018/08/16/2/6e13f452e2504408730c3f70a292252f.jpg",
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "RM",
          },
          content: "축하드려요:)",
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "J-Hope",
          },
          content: "우왕 굳",
        },
      ],
    },
  ],
  imagePaths: [], // 이미지 업로드 할때 이미지 경로들
  addPostLoading: false, // 게시글 추가가 완료 됐을 때
  addPostDone: false,
  addPostError: null,
  removePostLoading: false, // 게시글 삭제가 완료 됐을 때
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false, // 댓글 추가가 완료 됐을 때
  addCommentDone: false,
  addCommentError: null,
};

initialState.mainPosts = initialState.mainPosts.concat(
  Array(20)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          id: shortId.generate(),
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }))
);

/**
 * Action 이름을 상수로 뺌
 *  - reducer switch 문에서 const 값을 그대로 재활용 할 수 있음
 */
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

/**
 * 더미데이터 유용한 라이브러리
 * - npm i shortid (id값 생성)
 * - npm i faker (dummy data 제공)
 */
const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: "Jin",
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "Jin",
  },
});

// 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수 (불변성은 지키면서)
const reducer = (state = initialState, action) => {
  /**
   * draft
   * - ...state
   * state 건들지 말고 draft로만 조작한다
   */
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.addPostError = null;
        draft.mainPosts.unshift(dummyPost(action.data));
        // draft.mainPosts = [dummyPost(action.data), ...state.mainPosts];
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.removePostError = null;
        draft.mainPosts = state.mainPosts.filter(
          (value) => value.id !== action.data
        );
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        // action.data.content, action.data.postId, action.data.userId
        // const postIndex = state.mainPosts.findIndex(
        //   (value) => value.id === action.data.postId
        // );
        // const post = state.mainPosts[postIndex];
        // const Comments = [dummyComment(action.data.content), ...post.Comments];
        // const mainPosts = [...state.mainPosts];
        // mainPosts[postIndex] = { ...post, Comments };
        const post = draft.mainPosts.find(
          (value) => value.id === action.data.postId
        );
        post.Comments.unshift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        draft.addCommentError = null;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
