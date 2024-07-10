import { Routes, Route, Navigate } from "react-router-dom"

import ForOutsiders from "./auth/ForOutsiders"
import ForMembers from "./auth/ForMembers"

// Outsides Routes
import LoginForm from "./auth/LoginForm"
import RegisterForm from "./auth/RegisterForm"

// Members Routes
import Chats from "./pages/Chats/Chats"
import AddFriendForm from "./pages/AddFriendForm/AddFriendForm"
import Chat from "./pages/Chat/Chat"

const App = () =>  {

  return <Routes>

    <Route element={<ForOutsiders />}>
      <Route path="/login" element={<LoginForm />}/>
      <Route path="/register" element={<RegisterForm />}/>
    </Route>

    <Route element={<ForMembers />}>
      <Route path="/" element={<Navigate to="/chats" replace />}/>

      <Route path="/chats">
        <Route index element={<Chats/>} />
        <Route path=":id" element={<Chat />}/>
        <Route path="new-friend" element={<AddFriendForm />}/>
      </Route>

    </Route>
  </Routes>
}

export default App
