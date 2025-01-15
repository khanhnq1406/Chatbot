interface Props {
  onToggleChat: () => void;
}

export const ChatHeader: React.FC<Props> = ({ onToggleChat }: Props) => {
  return (
    <div className="chat-header">
      <div className="bot-info">
        <img src="/bot.png" alt="" className="avatar" />
        <div className="chat-title">Chatbot</div>
      </div>
      <button className="close" onClick={onToggleChat}>
        <img src="/cross.png"></img>
      </button>
    </div>
  );
};
