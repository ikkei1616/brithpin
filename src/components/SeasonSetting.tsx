import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useColorContext } from '@/context/ColorContext';
import Image from "next/image";
import { MenuItem } from '@mui/material';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SeasonSetting = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { colors } = useColorContext();

  const seasonMap: { [key: string]: string } = {
    '春': 'spring',
    '夏': 'summer',
    '秋': 'autumn',
    '冬': 'winter',
  };

  const handleSeasonClick = async (season: string) => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const seasonValue = seasonMap[season];

      try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, { season: seasonValue });
        } else {
          await setDoc(userRef, { season: seasonValue }, { merge: true });
        }
      } catch (error) {
        console.error("Error setting season:", error);
      }
    } else {
      console.log("User is not logged in");
    }
    handleClose();
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="flex h-full rounded-lg text-base w-full justify-between items-center p-0 text-textbrawnlight font-serif"
      >
        <div className="h-7 flex items-center w-7 justify-center rounded-2xl">
          <div style={{ background: colors.bg }} className="transform bg-pin text-color rounded-full bg-mainpink h-full w-full flex items-center justify-center">
            <Image
              src='/setting.png'
              alt="setting Image"
              width={16}
              height={16}
              className="rounded-lg object-cover bg-gray-100"
            />
          </div>
        </div>
        設定
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MenuItem onClick={() => handleSeasonClick('春')}>春</MenuItem>
          <MenuItem onClick={() => handleSeasonClick('夏')}>夏</MenuItem>
          <MenuItem onClick={() => handleSeasonClick('秋')}>秋</MenuItem>
          <MenuItem onClick={() => handleSeasonClick('冬')}>冬</MenuItem>
        </Box>
      </Modal>
    </div>
  );
};

export { SeasonSetting };
