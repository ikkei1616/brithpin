"use client";
import * as React from "react";
import AuthContext, { fetchFriendsID, fetchFriends } from "@/context/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {addDoc, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Timestamp } from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import { useColorContext } from '@/context/ColorContext';
import { BackgroundWrapper } from "@/components/BackgoundWrapper";

export type FriendSchema = {
  id: string;
  birthMonth: number;
  birthDay: number;
  nickname: string;
  name: string;
  photoURL: string;
};

export type ReceiveCard = {
  author: string;
  content: string;
  createAt: Timestamp;
  to: string;
};

export default function BirthTree() {
  const authValue = useContext(AuthContext);
  const router = useRouter();
  const [friends, setFriends] = useState<FriendSchema[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { colors, imageSrc, imageMailSrc } = useColorContext();
  
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [receiveCard, setReceiveCard] = useState<ReceiveCard[]>([]);
  const [displayReceiveCardNum, setDisplayReceiveCardNum] = useState(0);
  const [nickName, setNickName] = useState<string[]>([]);
  const [photoData,setPhotoData] = useState<string[]>([]);

  const handleOpen = (id: string) => {
    setOpenModalId(id);
  };
  const handleClose = () => {
    setOpenModalId(null);
  };
  const onClickRoute = () => {
    router.push("/account");
  };
  const handleSnackBarOpen = () => {
    setOpen(true);
  };

  const handleSnackBarClose = () => {
    setOpen(false);
  };

  const receiveCardModalOpen = () => {
    setOpenReceiveModal(true);
  };

  const receiveCardModalClose = () => {
    setOpenReceiveModal(false);
  };

  const cardForwardChange = () => {
    if (displayReceiveCardNum + 1 === receiveCard.length) {
      setDisplayReceiveCardNum(0);
    } else {
      setDisplayReceiveCardNum(displayReceiveCardNum + 1);
    }
  };

  const cardBackChange = () => {
    if (displayReceiveCardNum === 0) {
      setDisplayReceiveCardNum(receiveCard.length - 1);
    } else {
      setDisplayReceiveCardNum(displayReceiveCardNum - 1);
    }
  };

  const maxLeftValue = 100;
  const maxTopValue = 100;
  const locate = [
    { left: 43, top: 0 },
    { left: 30, top: 15 },
    { left: 60, top: 20 },
    { left: 42, top: 30 },
    { left: 20, top: 43 },
    { left: 48, top: 50 },
    { left: 75, top: 57 },
    { left: 40, top: 67 },
    { left: 10, top: 73 },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  useEffect(() => {
    (async () => {
      const friendIDList: string[] = await fetchFriendsID();

      fetchFriends(friendIDList);

      const friendList = await fetchFriends(friendIDList);

      setFriends(friendList);
    })();
  }, [authValue]);

  const sortFriendsByBirthday = (
    friendList: FriendSchema[]
  ): FriendSchema[] => {
    const today = new Date();

    return friendList.sort((a, b) => {
      const dateA = new Date(
        today.getFullYear(),
        a.birthMonth - 1,
        a.birthDay + 1
      );
      const dateB = new Date(
        today.getFullYear(),
        b.birthMonth - 1,
        b.birthDay + 1
      );

      // 今年の誕生日がまだ来ているかどうか判断
      const nextBirthdayA =
        dateA >= today
          ? dateA
          : new Date(today.getFullYear() + 1, a.birthMonth - 1, a.birthDay);
      const nextBirthdayB =
        dateB > today
          ? dateB
          : new Date(today.getFullYear() + 1, b.birthMonth - 1, b.birthDay);

      return nextBirthdayA.getTime() - nextBirthdayB.getTime();
    });
  };

  const sortedFriends = sortFriendsByBirthday(friends);
  const sortedFriendsWithBirthDayFlag = sortedFriends.map((friend) => {
    const today = new Date();
    const isBirthDayToday =
      today.getMonth() + 1 === friend.birthMonth &&
      today.getDate() === friend.birthDay;
    return {
      ...friend,
      isBirthDayToday,
    };
  });

  const saveMessage = async (
    event: React.FormEvent<HTMLFormElement>,
    friendId: string
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = formData.get("message")?.toString();
    const time = Timestamp.now();

    if (auth.currentUser?.uid == null) {
      return;
    }
    const docRef = collection(db, "cards");

    await addDoc(docRef, {
      author: auth.currentUser.uid,
      content: message,
      to: friendId,
      createAt: time,
    });
  };

  //送られてきたカードの情報と枚数の取得
  const getDocCardData = async (uid: string) => {
    const cardQuery = query(collection(db, "cards"), where("to", "==", uid));
    const cardSnapShot = await getDocs(cardQuery);

    const cardList = cardSnapShot.docs.map((cardDoc) => ({
      author: cardDoc.data().author,
      content: cardDoc.data().content,
      createAt: cardDoc.data().createAt,
      to: cardDoc.data().to,
    }));
    setReceiveCard(cardList);

    console.log("これがカードリストの長さ" + cardList.length);
  };

  const getDocAuthorData = async () => {
    const newNickNames = [];
    const newPhotoData = [];
    for (const card of receiveCard) {
      const author = card.author;
      console.log(author);
      const authorRef = doc(db, "users", author);
      const authorDocument = await getDoc(authorRef);
      if (authorDocument.exists()) {
        const nameData = authorDocument.data().nickname;
        const photoData = authorDocument.data().photoURL;
        newNickNames.push(nameData);
        newPhotoData.push(photoData);
      } else {
        console.log("指定されたユーザーのデータが存在しません");
      }
    }
    setNickName([...newNickNames]);
    setPhotoData([...newPhotoData]);
  };

  useEffect(() => {
    // Firebase認証状態を監視
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // ユーザーが認証されている場合にデータを取得
        getDocCardData(user.uid);
      } else {
        console.log("あいあい居合: ユーザーが認証されていません");
      }
    });
    return () => unsubscribe(); // クリーンアップのために監視を解除
  }, []);

  useEffect(() => {
    getDocAuthorData();
  }, [receiveCard]);

  // 実行
  return (
    <div className="flex w-screen h-screen  justify-center">
      <div className="wapper">
        <BackgroundWrapper>
          <Button
            onClick={onClickRoute}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
                border: 0,
              },
            }}
            style={{
              position: "absolute",
              left: 20,
              minWidth: 70,
            }}
          >
            <div className=" flex items-center justify-center rounded-2xl">
              <div style={{ background: colors.bg }} className="transform bg-pin text-color rounded-full h-7 w-7 flex items-center justify-center mr-2">
                ◀︎
              </div>
              <div className="text-lg text-textbrawnlight font-serif">TOP</div>
            </div>
          </Button>
          <Button
            onClick={receiveCardModalOpen}
            style={{
              position: "absolute",
              bottom: 7,
              right: 0,
              padding: 0,
            }}
          >
            <Image
              src={imageMailSrc}
              alt="mail box"
              width={45}
              height={45}
              style={{
                padding: 0,
              }}
            />
          </Button>
          {sortedFriendsWithBirthDayFlag.map((friend, index) => {
            if (index >= locate.length) return null;

            return (
              <>
                <Button
                  key={friend.id}
                  onClick={() => handleOpen(friend.id)}
                  disableRipple
                  disableElevation
                  sx={{
                    height: "100px",
                    position: "absolute",
                    left: `${(locate[index].left / maxLeftValue) * 100}%`,
                    top: `${(locate[index].top / maxTopValue) * 100}%`,
                    "&:hover": {
                      backgroundColor: "transparent",
                      border: 0,
                    },
                  }}
                >
                  <div>
                    <Image
                      src={imageSrc}
                      className="hidden-element"
                      alt="吹き出し"
                      style={{
                        position: "absolute",
                        top: -50,
                        minWidth: 70,
                        pointerEvents: "none",
                      }}
                      height={100}
                      width={100}
                    />
                    {/* 誕生日の場合にだけ hiyoko.svg を表示 */}
                    {friend.isBirthDayToday && (
                      <Image
                        src="/hiyoko.svg"
                        alt="ひよこ"
                        style={{
                          position: "absolute",
                          top: -85, // fukidashi.png の上に配置する
                          left: 10, // 位置調整は必要に応じて変更
                          width: 50, // 必要に応じてサイズを調整
                        }}
                      />
                    )}
                    <div
                      className="font-serif text-textbrawnlight"
                      style={{
                        position: "absolute",
                        top: -43,
                        left: 9,
                        width: "100%",
                        textAlign: "center",
                        fontSize: "10px",
                      }}
                    >
                      {`${friend.birthMonth} / ${friend.birthDay}`}
                      <br />
                      {friend.nickname}
                    </div>
                    <Image
                      src={friend.photoURL}
                      alt={`${friend.name}のアイコン`}
                      width={50}
                      height={50}
                      className="styles.friendIcon hiyoko-active"
                      style={{
                        clipPath: `circle(50% at 50% 50%)`,
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Button>
                <Modal
                  open={openModalId === friend.id}
                  onClose={handleClose}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{ ...style }}
                    className="
                      w-[350px] max-w-[90%] h-[350px]  max-h-[40%] 
                      p-0 rounded-[20px] outline-none border-2
                      border-mainpink sm:max-h-[50%]"
                  >
                    <form
                      action="#"
                      onSubmit={(event) => {
                        saveMessage(event, friend.id);
                        handleClose();
                        handleSnackBarOpen();
                      }}
                      className="h-[100%]"
                    >
                      <div className="pl-[5%] pr-[5%] h-[15%]">
                        <div className="w-full flex items-center justify-between pt-[7px] border-b border-dashed border-mainpink">
                          <Button
                            disableRipple
                            className="p-0 bg-[transparent]"
                            onClick={handleClose}
                          >
                            <Image
                              src="/card-modal-back-button.svg"
                              alt="backbutton"
                              width={30}
                              height={30}
                            />
                            <p className="text-textbrawn text-sm pl-[7px]">
                              戻る
                            </p>
                          </Button>
                          <p className="text-2xl font-aboreto text-textbrawn">
                            MESSAGE
                          </p>
                          <Button
                            disableRipple
                            className="p-0 bg-[transparent] "
                            type="submit"
                          >
                            <p className="text-textbrawn text-[sm] pr-[7px]">
                              送信
                            </p>
                            <Image
                              src="/CardSendButton.svg"
                              alt="SendButton"
                              width={30}
                              height={30}
                            />
                          </Button>
                        </div>
                      </div>
                      <div className="p-[8%_11%] h-[85%]">
                        <h2 className="text-center text-textbrawn font-serif">
                          お祝いメッセージを入力してね
                        </h2>
                        <p className="mt-[3%] text-textbrawn text-[xs] font-serif">
                          {friend.name}さんへ
                        </p>
                        <textarea
                          id={`message"-${friend.id}`}
                          name="message"
                          rows={6}
                          title="modal-text-area"
                          cols={15}
                          className="
                            w-full h-[70%] mt-[5px] border-2 
                            border-mainpink rounded-[10px]
                          "
                        ></textarea>
                      </div>
                    </form>
                  </Box>
                </Modal>
                <Snackbar
                  open={open}
                  autoHideDuration={4000} //スナックバーが消えるのにかかる時間を指定
                  message="送信が完了しました！"
                  onClose={handleSnackBarClose}
                  ContentProps={{
                    className: "bg-mainpink text-textbrawn",
                  }}
                />
                <Modal
                  open={openReceiveModal}
                  onClose={receiveCardModalClose}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box
                    sx={{ ...style }}
                    className="
                      w-[350px] max-w-[90%] 
                      p-0 rounded-[20px] outline-none border-2
                      border-mainpink sm:max-h-[50%]"
                  >
                    <div className="pl-[5%] pr-[5%] h-[15%]">
                      <div className="w-full flex items-center justify-center pt-[7px] border-b border-dashed border-mainpink">
                        <p className="text-2xl font-aboreto text-textbrawn">
                          HappyBirthday
                        </p>
                      </div>
                    </div>
                    <Button onClick={cardForwardChange}>進むボタン</Button>
                    <div className="p-[8%_11%] h-[85%]">
                      {receiveCard.length > 0 ? (
                        <div>
                          <Image src={photoData[displayReceiveCardNum]} width={100} height={100} alt="icon"></Image>
                          <div>{nickName[displayReceiveCardNum]}から</div>
                          <div>
                            {receiveCard[displayReceiveCardNum].content}
                          </div>
                        </div>
                      ) : (
                        <div>カードがありません</div>
                      )}
                    </div>
                    <Button onClick={cardBackChange}>戻るボタン</Button>
                  </Box>
                </Modal>
              </>
            );
          })}
        </BackgroundWrapper>
      </div>
    </div>
  );
}
