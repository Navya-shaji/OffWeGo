// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ChatContainer from "@/components/Modular/ChatContainer";
// import type { RootState } from "@/store/store";

// const ChatContainerWrapper = ({ userType }: { userType: "user" | "vendor" }) => {
//   const { chatId } = useParams();
//   if (!chatId) return null;

//   const [userId, vendorId] = chatId.split("_");


//   const auth = useSelector((state: RootState) =>
//     userType === "user"
//       ? state.auth.user
//       : state.vendorAuth.vendor
//   );

//   const myId = auth?.id;
//   const otherId = userType === "user" ? vendorId : userId;

//   // Avatar & name optional
//   const otherUser = {
//     id: otherId,
//     name: "User",
//     avatar: "",
//   };

//   return (
//     <ChatContainer
//       chatId={chatId}
//       myId={myId}
//       myType={userType}
//       other={otherUser}
//     />
//   );
// };

// export default ChatContainerWrapper;
