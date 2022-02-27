import React, { useCallback, useEffect, useRef } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  ADD_POST_REQUEST,
  LPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from "../reducers/post";
import useInput from "../hooks/useInput";

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  // 실제 DOM에 접근하기 위해서 useRef 사용
  const imageInput = useRef();

  // const [text, setText] = useState("");
  // const onChangeText = useCallback((e) => {
  //   setText(e.target.value);
  // }, []);
  const [text, onChangeText, setText] = useInput("");

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("게시글 작성해주세요");
    }
    // dispatch(addPost(text));
    // multer
    // - 한개면 req.file , 여러개면 req.files
    // - 나머지는 req.body에 넣어줌 -> req.body.image, req.body.content
    const formData = new FormData();
    // 이미지 경로
    imagePaths.forEach((value) => {
      formData.append("image", value);
    });
    formData.append("content", text);

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  // 이미지 업로드
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log(`imges `, e.target.files);
    // FormData = > Multipart 형식으로 보낼 수 잇음  서버에
    const iamgeFormData = new FormData();
    [].forEach.call(e.target.files, (file) => {
      // 서버의 upload.array("image")에서 image 키와 append의 "image"키가 동일해야함
      iamgeFormData.append("image", file);
    });
    dispatch({
      type: LPLOAD_IMAGES_REQUEST,
      data: iamgeFormData,
    });
  }, []);

  // 이미지 제거
  // map 안에 callback함수에 데이터 넣고 싶으면 고차함수 사용
  // 동기 Action
  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="게시글을 작성해주세요"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          Twit
        </Button>
      </div>
      <div>
        {imagePaths.map((value, index) => (
          <div key={value} style={{ display: "inline-block" }}>
            <img
              src={`http://localhost:4000/${value}`}
              style={{ width: "200px" }}
              alt={value}
            />
            <div>
              <Button onClick={onRemoveImage(index)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
