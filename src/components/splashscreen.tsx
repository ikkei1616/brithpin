import React,{ useEffect } from "react"
import anime from 'animejs';

interface SplashScreenProps {
  finishLoading: () => void; 
}



const SplashScreen: React.FC<SplashScreenProps> = ({finishLoading}) => {
  useEffect(() => {
    const loader = anime.timeline({
      complete: () => finishLoading()
    });
    loader.add({
      targets: "#logo",
      delay: 0,
      scale: 2,
      duration: 2000,
    });
  }, []);



  return  (
    <div style={{backgroundColor:"tranparent",height:"100%"}}>
      <img id="logo" src="/hiyoko.gif" alt="Logo" style={{height:"100vh",width:"100%"}}/>
    </div>
  );
}

export default SplashScreen