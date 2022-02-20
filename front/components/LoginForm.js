import React, { useState, useCallback } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import PropTypes from "prop-types";
import useInput from "../hooks/useInput";
import { useDispatch } from "react-redux";
import { loginAction } from "../reducers/user";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

/**
 * 함수형 컴포넌트에서 Rerendring 될 때
 * - 함수 안의 부분이 처음부터 끝가지 다시 실행되는 것은 맞음
 * - return 부분 중에서도 바뀌는 부분만 다시 그림 (이전 컴포넌트와 비교)
 * - return 부분 => VirtualDOM
 */
// const LoginForm = ({ setIsLoggedIn }) => {
/**
 * Component 의 Props를 넘기는 함수의 경우 useCallback 꼭 써야 함 => 최적화
 * useCallback
 * - 함수를 캐싱하는 것
 * useMemo
 * - 값을 캐싱하는 것
 * const style = useMemo(() => ({ marginTop: 10 }), []);
 * <div style={style}> </div> => 리렌더링되도 계속 같은 객체 유지
 */
// const [id, setId] = useState("");
// const [password, setPassword] = useState("");

// const onChangeId = useCallback((e) => {
//   setId(e.target.value);
// }, []);

// const onChangePassword = useCallback((e) => {
//   setPassword(e.target.value);
// }, []);
const LoginForm = () => {
  const dispatch = useDispatch();

  const [id, onChangeId] = useInput("");
  const [password, onChangePassword] = useInput("");

  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    dispatch(loginAction({ id, password }));
    // setIsLoggedIn(true);
  }, [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입 </Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

// LoginForm.propTypes = {
//   setIsLoggedIn: PropTypes.func.isRequired,
// };

export default LoginForm;
