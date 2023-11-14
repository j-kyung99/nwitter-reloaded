import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  // 필수 값이 아닐때는 ?사용
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  // tweets는 트윗 배열이고, 기본값은 빈배열
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        // db속 tweets 컬렉션
        orderBy("createdAt", "desc"),
        // createdAt을 기준으로 내림차순
        limit(25)
        // 첫 25개만 불러오도록 설정
      ); // 쿼리 작성
      /* const snapshot = await getDocs(tweetsQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          photo,
          id: doc.id,
        };
      }); */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        // getDocs 대신 onSnapshot 사용
        // 문서를 한 번만 가져오는 대신 쿼리에 리스너를 추가
        // 무언가가 삭제, 편집 또는 생성되었다는 알림을 받으면
        // 해당 쿼리의 문서를 보면서 우리한테 필요한 데이터를 추출
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
