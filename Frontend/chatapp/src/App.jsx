import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Chat from '../components/chat'
import SetUserName from '../components/SetUserName'
import Video from '../components/video'

function App() {
  const [username, setUsername] = useState("");

  return (
    <>
    {
    (!username ?(
<SetUserName
    setUsername={setUsername} 
/>):(
  <>
      <Chat 
       username ={username}
       setUsername={setUsername}
      />
     </>
)
    )
    }
  
    </>
  )
}

export default App
