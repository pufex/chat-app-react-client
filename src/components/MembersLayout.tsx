import { Outlet } from "react-router-dom";
import SocketProvider from "../socket-io/Socket";

const MembersLayout = () => {
    return <main className="App">
        <SocketProvider>
            <Outlet />
        </SocketProvider>
    </main>
}

export default MembersLayout
