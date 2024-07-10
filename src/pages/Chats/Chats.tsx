import GoAddFriend from "./components/GoAddFriend"
import ChatsList from "./components/ChatsList"
import ChatsHeader from "./components/ChatsHeader"

const Chats = () => {
  return <article
    className="chats-section"
  >
    <ChatsHeader/>
    <section className="chats__options">
      <GoAddFriend />
    </section>
    <ChatsList />
  </article>
}

export default Chats
