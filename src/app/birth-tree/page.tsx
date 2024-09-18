'use client';
import Image from "next/image";

export default function Home() {

  const maxLeftValue = 100;
  const maxTopValue = 100;
  const users = [
    { id: 1, name: "User1", birthday: '2002-09-18', icon: "/user1.png", left: 45, top: 0 },
    { id: 2, name: "User2", birthday: '2002-09-18', icon: "/user2.png", left: 30, top: 15 },
    { id: 3, name: "User3", birthday: '2002-09-18', icon: "/user3.png", left: 60, top: 20 },
    { id: 4, name: "User4", birthday: '2003-09-22', icon: "/user4.png", left: 42, top: 30 },
    { id: 5, name: "User5", birthday: '2003-09-25', icon: "/user5.png", left: 20, top: 43 },
    { id: 6, name: "User6", birthday: '2004-09-30', icon: "/user6.png", left: 48, top: 50 },
    { id: 7, name: "User7", birthday: '2004-10-20', icon: "/user7.png", left: 75, top: 57 },
    { id: 8, name: "User8", birthday: '2005-11-18', icon: "/user8.png", left: 40, top: 67 },
    { id: 9, name: "User9", birthday: '2005-12-18', icon: "/user9.png", left: 10, top: 73 },
  ]

  return (
    <div className="wapper">
      <div className="background">
        {users.map(user => (
          <div key={user.id}>
            <Image src={user.icon} alt={`${user.name}のアイコン`} width={50} height={50} style={{ position: "absolute", left: `${(user.left / maxLeftValue) * 100}%`, top: `${(user.top / maxTopValue) * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

