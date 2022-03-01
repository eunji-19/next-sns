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
  mainPosts: [],
  singlePost: null,
  imagePaths: [], // 이미지 업로드 할때 이미지 경로들
  hasMorePost: true,
  loadPostLoading: false, // 화면 로드 완료 됐을 때
  loadPostDone: false,
  loadPostError: null,
  addPostLoading: false, // 게시글 추가가 완료 됐을 때
  addPostDone: false,
  addPostError: null,
  removePostLoading: false, // 게시글 삭제가 완료 됐을 때
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false, // 댓글 추가가 완료 됐을 때
  addCommentDone: false,
  addCommentError: null,
  likePostLoading: false, // 좋아요
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false, // 좋아요 취소
  unlikePostDone: false,
  unlikePostError: null,
  uploadImagesLoading: false, // 이미지 업로드
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false, // 리트윗
  retweetDone: false,
  retweetError: null,
  loadSpecificPostLoading: false, // 하나의 게시글
  loadSpecificPostDone: false,
  loadSpecificPostError: null,
};

export const generateDummyPost = (number) =>
  Array(number)
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
    }));

// initialState.mainPosts = initialState.mainPosts.concat(generateDummyPost(10));

/**
 * Action 이름을 상수로 뺌
 *  - reducer switch 문에서 const 값을 그대로 재활용 할 수 있음
 */
export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LPLOAD_IMAGES_REQUEST = "LPLOAD_IMAGES_REQUEST";
export const LPLOAD_IMAGES_SUCCESS = "LPLOAD_IMAGES_SUCCESS";
export const LPLOAD_IMAGES_FAILURE = "LPLOAD_IMAGES_FAILURE";

export const REMOVE_IMAGE = "REMOVE_IMAGE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const LOAD_SPECIFIC_POST_REQUEST = "LOAD_SPECIFIC_POST_REQUEST";
export const LOAD_SPECIFIC_POST_SUCCESS = "LOAD_SPECIFIC_POST_SUCCESS";
export const LOAD_SPECIFIC_POST_FAILURE = "LOAD_SPECIFIC_POST_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

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
      case LOAD_SPECIFIC_POST_REQUEST:
        draft.loadSpecificPosttLoading = true;
        draft.loadSpecificPostDone = false;
        draft.loadSpecificPostError = null;
        break;
      case LOAD_SPECIFIC_POST_SUCCESS: {
        draft.loadSpecificPostLoading = false;
        draft.loadSpecificPosttDone = true;
        draft.loadSpecificPostError = null;
        draft.singlePost = action.data;
        break;
      }
      case LOAD_SPECIFIC_POST_FAILURE:
        draft.loadSpecificPostLoading = false;
        draft.loadSpecificPostError = action.error;
        break;
      case RETWEET_REQUEST:
        draft.retweetLoading = true;
        draft.retweetDone = false;
        draft.retweetError = null;
        break;
      case RETWEET_SUCCESS: {
        draft.retweetLoading = false;
        draft.retweetDone = true;
        draft.retweetError = null;
        draft.mainPosts.unshift(action.data);
        break;
      }
      case RETWEET_FAILURE:
        draft.retweetLoading = false;
        draft.retweetError = action.error;
        break;
      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter(
          (value, index) => index !== action.data
        );
        break;
      case LPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case LPLOAD_IMAGES_SUCCESS: {
        draft.imagePaths = action.data; // 서버에서 파일명을 보내줌
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.uploadImagesError = null;
        break;
      }
      case LPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;
      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find(
          (value) => value.id === action.data.postId
        );
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        draft.likePostError = null;
        break;
      }
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;
      case UNLIKE_POST_REQUEST:
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find(
          (value) => value.id === action.data.postId
        );
        post.Likers = post.Likers.filter(
          (value) => value.id !== action.data.UserId
        );
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        draft.unlikePostError = null;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error;
        break;
      case LOAD_USER_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      case LOAD_USER_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.loadPostError = null;
        // draft.mainPosts.unshift(dummyPost(action.data));
        // draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.hasMorePost = draft.mainPosts.length === 10;
        break;
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.addPostError = null;
        draft.mainPosts.unshift(action.data);
        draft.imagePaths = [];
        // draft.mainPosts.unshift(dummyPost(action.data));
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
          (value) => value.id !== action.data.postId
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
          (value) => value.id === action.data.PostId
        );
        post.Comments.unshift(action.data);
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
