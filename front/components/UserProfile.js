import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logoutAction } from "../reducers/user";

// const UserProfile = ({ setIsLoggedIn }) => {
const UserProfile = () => {
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    // setIsLoggedIn(false);
    dispatch(logoutAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹 <br />0
        </div>,
        <div key="following">
          팔로잉 <br />0
        </div>,
        <div key="follower">
          팔로워 <br />0
        </div>,
      ]}
    >
      <Card.Meta avatar={<Avatar>EJ</Avatar>} title="Eunji" />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

// UserProfile.propTypes = {
//   setIsLoggedIn: PropTypes.func.isRequired,
// };

export default UserProfile;
