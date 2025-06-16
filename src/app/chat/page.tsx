/* eslint-disable @next/next/no-img-element */
"use client";
import Container from "~/_components/Container";
import Modal from "~/_components/Modal";
import SearchableSelect from "~/_components/SearchSelect";
import Spinner from "~/_components/Spinner";
import {
  useAllUsersChat,
  useCreateNewChat,
  useDeleteChat,
  useAllChats,
} from "~/APIs/hooks/useChat";
import { useChatListSocket } from "~/hooks/useRealTimeAllChats";
import ChatPage from "./chatPage/chat";
import { useCallback, useEffect, useState } from "react";
import useLanguageStore, {
  useBooleanValue,
  useUserDataStore,
} from "~/APIs/store";
import { Controller, useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { Text } from "~/_components/Text";
interface ChatData {
  chatId: string;
  lastMessage: string;
  numberOfNewMessages: number;
  targetUser: {
    id: string;
    name: string;
    Role: string;
    hasPhoto?: boolean;
    photoLink?: string;
  };
}
const Chat = () => {
  const userData = useUserDataStore.getState().userData;
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [realuserId, setRealUserId] = useState("");
  const [userName, setUserNane] = useState("");
  const [userRole, setUserRloe] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);

  const { mutate: createChat } = useCreateNewChat();
  const { mutate: deleteChat } = useDeleteChat();
  const { data: users, isLoading: isGetting } = useAllUsersChat();
  const { data, isLoading, refetch: regetusers } = useAllChats();

  const optionsRigon =
    users?.data?.content.map((user: { Role: any; id: any; name: any }) => ({
      value: user.id,
      label: `${user.name} - ${user.Role}`,
    })) || [];

  const handleDelete = (chatId: string) => {
    deleteChat(chatId, {
      onSuccess: () => {
        regetusers();
        setUserId("");
      },
      onError: (error) => {
        console.error("Error deleting chat:", error);
      },
    });
  };
  const language = useLanguageStore((state) => state.language);
  const bool = useBooleanValue((state) => state.boolean);

  const onSubmit = (formData: { targetUserId: string }) => {
    createChat(
      { targetUserId: formData.targetUserId },
      {
        onSuccess: () => {
          regetusers();
          handleCloseModal();
        },
        onError: (error) => {
          console.error("Error creating chat:", error);
        },
      },
    );
  };

  const [localChats, setLocalChats] = useState(data?.data?.content || []);
  const currentUserId = userData.id;

  useEffect(() => {
    if (data?.data?.content) {
      setLocalChats(data.data.content);
    }
  }, [data]);

  const handleChatUpdate = useCallback((update: ChatData) => {
    setLocalChats((prevChats: ChatData[]) => {
      // Find if the chat already exists
      const existingChatIndex = prevChats.findIndex(
        (chat) => chat.chatId === update.chatId,
      );

      if (existingChatIndex === -1) {
        return [update, ...prevChats];
      }

      const updatedChats: ChatData[] = [...prevChats];
      updatedChats[existingChatIndex] = {
        ...updatedChats[existingChatIndex],
        chatId: update.chatId,
        lastMessage: update.lastMessage,
        numberOfNewMessages: update.numberOfNewMessages,
        targetUser: {
          ...(updatedChats[existingChatIndex]?.targetUser ?? {}),
          ...update.targetUser,
        },
      };

      // Sort chats to bring the most recently updated chat to the top
      return updatedChats.sort((a: ChatData, b: ChatData) => {
        if (a.chatId === update.chatId) return -1;
        if (b.chatId === update.chatId) return 1;
        return 0;
      });
    });
  }, []);

  const clearNewMessages = useCallback((chatId: string) => {
    setLocalChats((prevChats: ChatData[]) =>
      prevChats.map(
        (chat: ChatData): ChatData =>
          chat.chatId === chatId ? { ...chat, numberOfNewMessages: 0 } : chat,
      ),
    );
  }, []);

  // Effect to clear new messages when a chat is selected
  useEffect(() => {
    if (userId) {
      clearNewMessages(userId);
    }
  }, [userId, clearNewMessages]);

  const { isConnected } = useChatListSocket(currentUserId, handleChatUpdate);

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleOpenModal2 = () => {
    setModalOpen2(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleCloseModal2 = () => {
    setModalOpen2(false);
  };
  const handleClick = (id: string) => {
    setUserId(id);
  };

  type FormData = {
    targetUserId: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div
      className={cn("transition-transform duration-300 ease-in", {
        // LTR layout
        "lg:ml-[260px]": bool && language !== "ar",
        "lg:ml-[90px]": !bool && language !== "ar",
        // RTL layout
        "lg:mr-[260px]": bool && language === "ar",
        "lg:mr-[90px]": !bool && language === "ar",
      })}
    >
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="flex w-full justify-between rounded-lg flex-col lg:flex-row"
      >
        <div className="flex w-full lg:w-[50%] xl:w-[65%] rounded-xl bg-bgSecondary">
          {userId == "" ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <img
                src="/images/chat-empty.png"
                alt="#"
                className="block dark:hidden"
              />
              <img
                src="/images/chat-empty-dark.png"
                alt="#"
                className="hidden dark:block"
              />
              <Text
                className="max-w-[400px] text-center"
                color={"gray"}
                size={"xl"}
                font={"medium"}
              >
                {language === "en"
                  ? "To start a conversation, select a chat and begin interacting now."
                  : language === "ar"
                    ? "لبدء محادثة، اختر دردشة وابدأ التفاعل الآن."
                    : "Pour commencer une conversation, sélectionnez une discussion et commencez à interagir dès maintenant."}
              </Text>
            </div>
          ) : (
            <ChatPage
              userId={userId}
              regetusers={regetusers}
              userName={userName}
              userRole={userRole}
              realuserId={realuserId}
            />
          )}
        </div>
        <div className="h-[calc(100vh-90px)] w-full lg:w-[50%] xl:w-[35%] overflow-y-auto bg-bgPrimary p-5">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex justify-between text-start text-[22px] font-semibold">
                  <h1>
                    {language === "en"
                      ? "Chat"
                      : language === "ar"
                        ? "دردشة"
                        : "Chat"}
                  </h1>
                  <button onClick={handleOpenModal}>
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-6 grid items-start">
                  <div>
                    <label htmlFor="icon" className="sr-only">
                      Search
                    </label>
                    <div className="relative min-w-48 md:min-w-80">
                      <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                        <svg
                          className="size-4 flex-shrink-0 text-textSecondary"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </div>
                      <input
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        id="icon"
                        name="icon"
                        className="block w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                        placeholder={"Search"}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid w-full gap-2">
                  {localChats
                    .filter((chat: { targetUser: { name: string } }) => {
                      return search.toLocaleLowerCase() === ""
                        ? chat
                        : chat.targetUser.name
                            .toLocaleLowerCase()
                            .includes(search);
                    })
                    .map((chat: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleClick(chat.chatId);
                          setUserNane(chat.targetUser.name);
                          setUserRloe(chat.targetUser.Role);
                          setRealUserId(chat.targetUser.id);
                          regetusers();
                        }}
                        className="flex w-full items-center cursor-pointer border-b border-borderPrimary px-2 py-2 hover:bg-bgSecondary"
                      >
                        {/* User image */}
                        <div className="w-14 shrink-0">
                          <img
                            src={
                              chat.targetUser.hasPhoto
                                ? chat.targetUser.photoLink
                                : "/images/userr.png"
                            }
                            className="h-10 w-10 rounded-lg object-cover"
                            alt="#"
                          />
                        </div>

                        {/* Chat details */}
                        <div className="min-w-0 flex-1 px-2">
                          <p className="truncate font-semibold">
                            {chat.targetUser.name}
                            <span className="text-[15px] text-textSecondary">
                              ({chat.targetUser.Role})
                            </span>
                          </p>
                          <p className="mt-1 truncate text-sm text-textSecondary">
                            {chat.lastMessage}
                          </p>
                        </div>

                        {/* Delete button and unread counter */}
                        <div className="flex shrink-0 flex-col items-end gap-2 ps-2">
                          <button onClick={handleOpenModal2}>
                            <svg
                              className="h-6 w-6 text-error"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <Modal
                            isOpen={isModalOpen2}
                            onClose={handleCloseModal2}
                          >
                            <div className="rounded-lg p-6 text-center">
                              <h2 className="mb-4 text-xl font-bold text-gray-800">
                                Are You Sure to Delete This Chat?
                              </h2>
                              <div className="flex justify-center space-x-4">
                                <button
                                  onClick={() => {
                                    handleDelete(chat.chatId);
                                    handleCloseModal2();
                                  }}
                                  className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={handleCloseModal2}
                                  className="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          </Modal>

                          {chat.numberOfNewMessages > 0 && (
                            <span className="rounded-full bg-primary px-2 text-sm text-white">
                              {chat.numberOfNewMessages}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {isGetting ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="targetUserId"
              className="grid font-sans text-[18px] font-semibold"
            >
              New Chat
              {/* default */}
              <Controller
                name="targetUserId"
                control={control}
                rules={{ required: "School selection is required" }}
                defaultValue="" // Initialize with a default value
                render={({ field: { onChange, value } }) => (
                  <SearchableSelect
                    value={value}
                    onChange={onChange}
                    options={optionsRigon}
                    placeholder="Select Chat"
                  />
                )}
              />
            </label>
            <button
              disabled={isLoading}
              type="submit"
              className="hover:bg-hover mt-5 w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:shadow-xl"
            >
              {isLoading ? "Adding..." : "Add Chat"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Chat;
