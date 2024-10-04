import Stac from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return(
    <>
      <Stac
        sx={{ 
          justifyContent: 'center',
          alignItems: 'center',        
          height: '100vh',
          width: '100vw' ,
        }} 
        spacing={2} 
        direction="row"
        >
        <CircularProgress color="secondary" 
          size = {200}
          thickness = {1.2}
          sx={{ 
          color: '#FEB69F',
          }} 
        />
      </Stac>  
    </>
  )
}

export default Loading

