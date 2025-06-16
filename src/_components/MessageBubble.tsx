import { BsCheck2All } from "react-icons/bs";

/* eslint-disable @next/next/no-img-element */
interface MessageProps {
  message: {
    content: string;
    creationTime: string;
    imageUrl?: string;
  };
  isCurrentUser: boolean;
  userName: string;
}

export const MessageBubble = ({ message, isCurrentUser, userName }: MessageProps) => {
  const formatTime = (datetimeString: string) => {
    const date = new Date(datetimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div dir={`${!isCurrentUser ? "ltr" : "rtl"}`} className={`mb-4 flex w-[320px] break-words rounded-lg p-3 font-semibold ${!isCurrentUser
            ? "mr-auto text-left text-white"
            : "ml-auto text-left text-black"
          }`}>
        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${!isCurrentUser ? "bg-[#E2E8F0]" : "bg-[#3E5AF0]"} rounded-xl ${!isCurrentUser ? "dark:bg-gray-700" : "dark:bg-blue-900"} `}>
          <p className={`text-sm font-normal py-2.5  ${isCurrentUser ? "text-white": "text-black"} dark:text-white`}>{message.content}</p>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-normal flex justify-end text-white dark:text-gray-400">
            {!isCurrentUser ? "" : 
              <BsCheck2All />
              }
          </span>
            <span className={`text-sm font-normal ${isCurrentUser ? "text-white": "text-black"} font-medium dark:text-gray-400`} dir="ltr">{formatTime(message.creationTime)}</span>
          </div>
        </div>

      </div>
    </>
  );
};
