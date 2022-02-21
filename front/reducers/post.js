/**
 * 대문자와 소문자 차이(User, content)
 * - DB Sequlize와 연관되어 있음
 * - Sequlize에서 어떤 정보와 다른 정보가 관계가 있으면 합쳐줌 -> 대문자가 되어서 나타남
 * - id, content : 게시글 자체의 속성
 * - User, Images, Comments : 다른 정보들과 합쳐서 줌 (대문자)
 */
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
          src: "https://img1.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202108/25/starnews/20210825072239576oxwf.jpg",
        },
        {
          src: "https://thumb.mtstarnews.com/06/2022/01/2022011507103964279_1.jpg/dims/optimize",
        },
        {
          src: "http://file3.instiz.net/data/cached_img/upload/2018/08/16/2/6e13f452e2504408730c3f70a292252f.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "RM",
          },
          content: "축하드려요:)",
        },
        {
          User: {
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
  addCommentLoading: false, // 게시글 추가가 완료 됐을 때
  addCommentDone: false,
  addCommentError: null,
};

/**
 * Action 이름을 상수로 뺌
 *  - reducer switch 문에서 const 값을 그대로 재활용 할 수 있음
 */
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

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

const dummyPost = {
  id: 2,
  content: "데이터입니다",
  User: {
    id: 1,
    nickname: "Jin",
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 앞에 추가를 해야 게시글 위에 올라감
        addPostLoading: false,
        addPostDone: true,
        addPostError: null,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        addCommentLoading: false,
        addCommentDone: true,
        addCommentError: null,
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
