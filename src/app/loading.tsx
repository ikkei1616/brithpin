import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return(
    <>
      <Stack
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
      </Stack>  
    </>
  )
}

export default Loading

