/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { FiFlag } from "react-icons/fi";
import { FaBusAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { MdAttachMoney } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa6";
import { useTheme } from "next-themes";
import { FaStar } from "react-icons/fa6";
import { Switch } from "~/components/ui/switch";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Cookie from "js-cookie";
import { useBooleanValue, useUserDataStore } from "~/APIs/store";
import { useProfile } from "~/APIs/hooks/useProfile";
import { useNotificationsWebSocket } from "~/hooks/useNotifications";

const useWindowDimensions = () => {
  const isClient = typeof window === "object";
  const [windowSize, setWindowSize] = useState(
    isClient
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: undefined, height: undefined },
  );

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  return windowSize;
};

interface NavBarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  small: boolean;
  url: string;
}

const NavBarLink = ({
  href,
  icon: Icon,
  label,
  small,
  url,
}: NavBarLinkProps) => {
  const isActive = url === href;
  return (
    <li>
      <Link
        className={`flex ${small ? "w-[40px]" : ""} text-md text-navLinks group mt-4 items-center gap-x-3.5 rounded-lg px-2.5 py-2 font-sans font-semibold hover:bg-bgSecondary hover:text-primary`}
        href={href}
      >
        <Icon
          className={`h-10 w-10 ${small ? "" : "pl-4"} ${
            isActive
              ? `${small ? "" : "border-l-2"} border-primary text-primary`
              : ""
          }`}
        />
        {!small && (
          <p className={`translate-y-0.5 ${isActive ? "text-primary" : ""}`}>
            {label}
          </p>
        )}
      </Link>
    </li>
  );
};

const NavBar = () => {
  const toggleNav = useBooleanValue((state) => state.toggle)

  const [profile, setProfile] = useState(false);
  const toggleProfile = () => {
    setProfile(!profile);
  };
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { theme, setTheme } = useTheme();
  const url = usePathname();
  const [small, setSmall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };
  const toggleNavbar5 = () => {
    setIsOpen5(!isOpen5);
  };

  const DeleteCookie = () => {
    Cookie.remove("token");
  };

  const toggleNavbarSmall = () => {
    setSmall(!small);
    if (!small == true) {
      setIsOpen5(true);
    }
    if (small == true) {
      setIsOpen5(false);
    }
  };
  const { data: dataUpdate } = useProfile();
  useUserDataStore.getState().setUserData({ 
    username: dataUpdate?.data.username, 
    email: dataUpdate?.data.email, 
    name_en: dataUpdate?.data.name, 
    id: dataUpdate?.data.id?.toString(), 
    picture: dataUpdate?.data.picture, 
});
const userData = useUserDataStore.getState().userData;
const userId = userData.id;
const { notificationsCount, isConnected } = useNotificationsWebSocket(userId);
  const OpenSideBar = () => {
    setIsOpen(!isOpen);
  };

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width !== undefined && width >= 1023) {
      setIsOpen(true);
    }
  }, [width]);

  const navLinks = [
    { href: "/", icon: AiFillHome, label: "Home" },
    { href: "/grades", icon: FaStar, label: "Grades" },
    { href: "/academic", icon: FaGraduationCap, label: "Academic" },
    { href: "/follow-up", icon: IoPersonSharp, label: "Follow up" },
    { href: "/bus", icon: FaBusAlt, label: "Bus Tracker" },
    { href: "/finance", icon: MdAttachMoney, label: "Finance" },
    { href: "/complaint", icon: FiFlag, label: "Complaint" },
    { href: "/exam", icon: FaPencilAlt, label: "Exam" },
  ];

  // if (!isClient)
  //   return (
  //     <div className="absolute left-0 top-0 z-[9999] flex h-screen w-full items-center justify-center bg-bgPrimary">
  //       <Spinner />
  //     </div>
  //   );

  return (
    <>
      <header>
        <div>
          <header
            className={`sticky inset-x-0 top-0 z-[48] flex w-full flex-wrap bg-bgPrimary py-2.5 text-sm sm:flex-nowrap sm:justify-start sm:py-4 lg:ps-64`}
          >
            <nav
              className="mx-auto flex w-full basis-full items-center px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="me-5 lg:me-0 lg:hidden">
                <Link
                  className="inline-block flex-none rounded-xl text-xl font-semibold focus:opacity-80 focus:outline-none"
                  href="/"
                  aria-label="Preline"
                >
                  <img src="/images/logo.png" alt="#" />
                </Link>
              </div>
              <div className="ms-auto flex w-full items-center justify-end sm:order-3 sm:justify-between sm:gap-x-3">
                <div className="sm:hidden">
                  <button
                    type="button"
                    className="inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      className="size-4 flex-shrink-0"
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
                  </button>
                </div>

                <div className="hidden sm:block"></div>

                <div className="flex flex-row items-center justify-end gap-2">
                  <Switch
                    checked={theme === "dark"} 
                    onCheckedChange={handleThemeChange} 
                    className="mx-1" 
                  />
                  <Link
                    href="/notifies"
                    className="relative inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      className="size-4 flex-shrink-0"
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
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {notificationsCount > 0 && (
                      <div className="absolute top-4 left-5 bg-sky-500 text-white w-4 h-4 rounded-full flex justify-center items-center text-center text-sm">
                        <span>{notificationsCount}</span>
                      </div>
                    )}
                  </Link>
                  <Link
                    href="/chat"
                    className="inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full text-sm font-semibold text-textPrimary hover:bg-bgSecondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      className="h-5 w-5 text-textPrimary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </Link>

                  <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          onClick={toggleProfile}
                          id="hs-dropdown-with-header"
                          type="button"
                          className="border-bgSeconday hover:bg-thead inline-flex h-[2.375rem] w-[2.375rem] items-center justify-center gap-x-2 rounded-full border text-sm font-semibold text-gray-800 outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          <div>
                          <img
                              className="inline-block h-[38px] w-[38px] rounded-full ring-2 ring-bgSecondary"
                              src={`${userData.picture ?? "/images/userr.png"}`}
                              alt="User Avatar"
                            />
                          </div>
                        </button>
                      </DropdownMenu.Trigger>

                      {profile && (
                        <DropdownMenu.Content
                          className={`text-textPrimary fixed right-[20px] top-[20px] min-w-60 rounded-lg bg-bgPrimary p-2 shadow-md`}
                          aria-labelledby="hs-dropdown-with-header"
                          align="end"
                          sideOffset={5}
                        >
                          <div className="rounded-t-lg bg-bgPrimary px-5 py-3">
                            <p className="text-textPrimary text-sm">
                              Signed in as
                            </p>
                            <p className="text-textPrimary text-sm font-medium">
                            {userData?.email}
                            </p>
                          </div>
                          <div className="mt-2 py-2">
                            <DropdownMenu.Item asChild>
                              <Link
                                className="text-textPrimary flex items-center gap-x-3.5 rounded-lg border-none px-3 py-2 text-sm outline-none hover:bg-bgSecondary"
                                href="/profile"
                              >
                                <svg
                                  className="h-4 w-4 flex-shrink-0"
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
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Profile
                              </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item asChild>
                              <a
                              onClick={()=> DeleteCookie()}
                                className="text-textPrimary flex items-center gap-x-3.5 rounded-lg border-none px-3 py-2 text-sm outline-none hover:bg-error hover:text-white"
                                href="/login"
                              >
                                Sign out
                              </a>
                            </DropdownMenu.Item>
                          </div>
                        </DropdownMenu.Content>
                      )}
                    </DropdownMenu.Root>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <div className="sticky inset-x-0 top-0 z-20 border-y border-borderPrimary bg-bgPrimary px-4 sm:px-6 md:px-8 lg:hidden">
            <div className="flex items-center justify-between py-2">
              <ol className="ms-3 flex items-center whitespace-nowrap">
                <li className="flex items-center text-sm text-textPrimary">
                  {/* Breadcrumb or other content */}
                </li>
              </ol>

              <button
                onClick={OpenSideBar}
                type="button"
                className="flex items-center justify-center gap-x-1.5 rounded-lg border border-borderPrimary px-3 py-2 text-xs text-gray-500 hover:text-gray-600"
                data-hs-overlay="#application-sidebar"
                aria-controls="application-sidebar"
                aria-label="Sidebar"
              >
                <svg
                  className="size-4 flex-shrink-0"
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
                  <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
                </svg>
                <span className="sr-only">Sidebar</span>
              </button>
            </div>
          </div>
          {isOpen && (
            <div
              dir={"ltr"}
              id="application-sidebar"
              className={`hs-overlay hs-overlay-open:translate-x-0 transform transition-all duration-300 [--auto-close:lg] ${
                small ? "w-[90px]" : "w-[260px]"
              } drop-shadow-2xl lg:drop-shadow-none ${
                !isOpen ? "w-0" : ""
              } fixed inset-y-0 start-0 z-[60] bg-bgPrimary duration-300 ease-in lg:bottom-0 lg:end-auto lg:block lg:translate-x-0 overflow-y-auto`}
            >
              <div className="px-8 pt-4">
                <Link href="/">
                  {small ? (
                    <img
                      className="mt-5 scale-[2]"
                      src="/images/small logo.png"
                      alt="Logo"
                    />
                  ) : (
                    <img
                      className="-translate-7 w-[150px] translate-y-3"
                      src="/images/logo.png"
                      alt="Logo"
                    />
                  )}
                </Link>
              </div>
              <div className="mx-5 flex -translate-y-6 justify-end">
                {!small && (
                  <button onClick={toggleNavbarSmall}>
                    <svg
                      className="h-8 w-8 text-textPrimary"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              <nav
                className={`hs-accordion-group flex w-full flex-col flex-wrap p-6 ${
                  !isOpen ? "hidden" : ""
                } `}
                data-hs-accordion-always-open
              >
                <ul className="space-y-1.5">
                  <div
                    className={`flex ${small ? "w-[40px]" : ""} justify-center`}
                  >
                    {small && (
                      <button onClick={toggleNavbarSmall}>
                        <svg
                          className="h-6 w-6 text-textPrimary"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="9 6 15 12 9 18" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {navLinks.map((link) => (
                    <NavBarLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      label={link.label}
                      small={small}
                      url={url}
                    />
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default NavBar;
