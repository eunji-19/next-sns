import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const followerList = [
    { nickname: "김석진" },
    { nickname: "김남준" },
    { nickname: "전정국" },
  ];
  const followingList = [
    { nickname: "민윤기" },
    { nickname: "김태형" },
    { nickname: "정호석" },
  ];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
