/* eslint-disable @next/next/no-img-element */
"use client";
import Container from "~/_components/Container";
import * as React from "react";
import { Calendar } from "~/components/ui/calendar";
import { Text } from "~/_components/Text";
import { format } from "date-fns";
import Box from "~/_components/Box";
import { FiDownload } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";
import { PiLineVerticalBold } from "react-icons/pi";
import BoxGrid from "~/_components/BoxGrid";
import { PiLineVertical } from "react-icons/pi";
import Link from "next/link";

function CalendarDemo({
  onDateSelect,
}: {
  onDateSelect: (date: Date) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateSelect(newDate);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      className="flex w-fit justify-center rounded-md max-[1080px]:w-full"
    />
  );
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const formattedDate = React.useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate],
  );
  function convertToAmPm(time24: string): string {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    const match = timeRegex.exec(time24);

    if (!match) {
      throw new Error(
        "Invalid time format. Please use HH:MM:SS in 24-hour format.",
      );
    }

    const [hoursStr, minutes] = match;
    let hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  }

  // const { data, isLoading } = useGetAllSchedules(formattedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Container>
      <div className="mb-4 flex w-full gap-10 max-[1080px]:grid">
        <div className="flex overflow-auto md:overflow-visible">
          <CalendarDemo onDateSelect={handleDateSelect} />
        </div>

        <Box className="overflow-auto">
          <div className="flex justify-between">
            <Text font={"semiBold"} size={"xl"} className="mb-3">
              Today Classes
            </Text>
            <div className="flex gap-2">
              <Text font={"semiBold"} color={"primary"}>
                Download weekly class timetable
              </Text>
              <FiDownload size={20} className="text-primary" />
            </div>
          </div>

          <table className="w-full border-separate border-spacing-y-2 overflow-x-auto p-4 text-left text-sm">
            <thead className="text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  Teacher
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  Time
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  Room
                </th>
              </tr>
            </thead>
            <tbody className="rounded-lg">
              <tr className="bg-bgSecondary font-semibold transition hover:bg-primary hover:text-white">
                <th
                  scope="row"
                  className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium"
                >
                  English
                </th>
                <td className="whitespace-nowrap px-6 py-4">Asmaa Amrabat</td>
                <td className="whitespace-nowrap px-6 py-4">
                  10:30 am-11:30 am
                </td>
                <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">9</td>
              </tr>
              <tr className="bg-bgSecondary font-semibold transition hover:bg-primary hover:text-white">
                <th
                  scope="row"
                  className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium"
                >
                  Break
                </th>
                <td className="whitespace-nowrap px-6 py-4">-</td>
                <td className="whitespace-nowrap px-6 py-4">-</td>
                <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">-</td>
              </tr>
              <tr className="bg-bgSecondary font-semibold transition hover:bg-primary hover:text-white">
                <th
                  scope="row"
                  className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium"
                >
                  Physics
                </th>
                <td className="whitespace-nowrap px-6 py-4">Asmaa Amrabat</td>
                <td className="whitespace-nowrap px-6 py-4">
                  10:30 am-11:30 am
                </td>
                <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">9</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-center gap-1 text-primary">
            <Text color={"primary"}>Show more </Text>
            <div className="mt-[2px]">
              <AiOutlineDown size={20} />{" "}
            </div>
          </div>
        </Box>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/5 xl:w-1/3 rounded-xl bg-bgPrimary p-4 shadow h-fit">
          <Text font={"bold"} size={"xl"}>
            Today&apos;s Attendance
          </Text>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-borderPrimary p-4">
            <div className="flex">
              <div>
                <Text font={"semiBold"} className="mt-1">
                  09:00 AM
                </Text>
                <Text font={"semiBold"} color={"gray"} className="mt-1">
                  09:45 AM
                </Text>
              </div>
              <PiLineVerticalBold size={60} className="text-success" />
              <div>
                <Text font={"semiBold"} className="mt-1">
                  Science{" "}
                </Text>
                <Text font={"semiBold"} color={"gray"} className="mt-1">
                  Room 9
                </Text>
              </div>
            </div>
            <div className="flex h-fit items-center justify-center rounded-full bg-success px-4 py-2 text-white">
              Presence
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-borderPrimary p-4">
            <div className="flex">
              <div>
                <Text font={"semiBold"} className="mt-1">
                  09:00 AM
                </Text>
                <Text font={"semiBold"} color={"gray"} className="mt-1">
                  09:45 AM
                </Text>
              </div>
              <PiLineVerticalBold size={60} className="text-error" />
              <div>
                <Text font={"semiBold"} className="mt-1">
                  Science{" "}
                </Text>
                <Text font={"semiBold"} color={"gray"} className="mt-1">
                  Room 9
                </Text>
              </div>
            </div>
            <div className="flex h-fit items-center justify-center rounded-full bg-error px-4 py-2 text-white">
              Absence
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-borderPrimary p-4">
            <div className="flex">
              <div>
                <Text font={"semiBold"} className="mt-1">
                  09:00 AM
                </Text>
                <Text font={"semiBold"} color={"gray"} className="mt-1">
                  09:45 AM
                </Text>
              </div>
              <PiLineVerticalBold size={60} className="text-success" />
              <div>
                <Text font={"semiBold"} className="mt-1">
                  Science{" "}
                </Text>
                <Text font={"semiBold"} color={"gray"} className="mt-1">
                  Room 9
                </Text>
              </div>
            </div>
            <div className="flex h-fit items-center justify-center rounded-full bg-success px-4 py-2 text-white">
              Presence
            </div>
          </div>
          <Text font={"bold"} size={"lg"} className="mt-4">
            Attendance Summary
          </Text>
          <Text font={"semiBold"} color={"gray"} className="mb-4">
            Last 30 Days
          </Text>
          <BoxGrid>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Total Classes
              </Text>
              <Text font={"semiBold"}>20</Text>
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Presence
              </Text>
              <Text font={"semiBold"}>15</Text>
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Absence
              </Text>
              <Text font={"semiBold"}>5</Text>
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                Late
              </Text>
              <Text font={"semiBold"}>0</Text>
            </Box>
          </BoxGrid>
        </div>
        <div>
        <div className="w-full rounded-xl bg-bgPrimary p-4 shadow h-fit" >
          <Text font={"bold"} size={"xl"} className="mb-8">
            Today&apos;s Materials
          </Text>
          <div>
            <div>
              <Text size={"xl"} className="mb-2">
                Science
              </Text>
              <div className="flex rounded-xl border border-borderPrimary p-2">
                <PiLineVertical size={125} className="-ml-12 text-primary" />
                <div className="-ml-10 mt-2 w-[90%]">
                  <Text size={"xl"}>Understanding Simple Past Tense</Text>
                  <Text color={"gray"} className="my-1">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iste, molestiae? Quod, voluptates! Illo animi quasi, quia
                    enim blanditiis tenetur eius vitae eveniet laudantium harum
                    totam ea quas pariatur asperiores neque!
                  </Text>
                  <Link href={"#"} className="text-primary underline">
                    Open File
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Text size={"xl"} className="mb-2">
                Science
              </Text>
              <div className="flex rounded-xl border border-borderPrimary p-2">
                <PiLineVertical size={125} className="-ml-12 text-primary" />
                <div className="-ml-10 mt-2 w-[90%]">
                  <Text size={"xl"}>Understanding Simple Past Tense</Text>
                  <Text color={"gray"} className="my-1">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iste, molestiae? Quod, voluptates! Illo animi quasi, quia
                    enim blanditiis tenetur eius vitae eveniet laudantium harum
                    totam ea quas pariatur asperiores neque!
                  </Text>
                  <Link href={"#"} className="text-primary underline">
                    Open File
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1 text-primary mt-4">
                <Text color={"primary"}>Show more </Text>
                <div className="mt-[2px]">
                  <AiOutlineDown size={20} />{" "}
                </div>
              </div>
        </div>
        <div className="w-full rounded-xl bg-bgPrimary p-4 shadow h-fit my-4" >
          <Text font={"bold"} size={"xl"} className="mb-8">
            Today&apos;s Materials
          </Text>
          <div>
            <div>
              <div className="flex rounded-xl border border-borderPrimary p-2">
                <PiLineVertical size={125} className="-ml-12 text-primary" />
                <div className="-ml-10 mt-2 w-[90%]">
                  <Text size={"xl"}>Homework name</Text>
                  <Text font={"semiBold"} color={"error"}>Deadline: 23 May (Wednesday)</Text>
                  <Text color={"gray"} className="my-1">
                  Lorem ipsum dolor sit amet consectetur. Morbi aenean ut ipsum sed integer quis nunc. Augue nulla laoreet mattis enim Lorem ipsum dolor sit amet consectetur. 
                  </Text>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex rounded-xl border border-borderPrimary p-2">
                <PiLineVertical size={125} className="-ml-12 text-primary" />
                <div className="-ml-10 mt-2 w-[90%]">
                  <Text size={"xl"}>Homework name</Text>
                  <Text font={"semiBold"} color={"error"}>Deadline: 23 May (Wednesday)</Text>
                  <Text color={"gray"} className="my-1">
                  Lorem ipsum dolor sit amet consectetur. Morbi aenean ut ipsum sed integer quis nunc. Augue nulla laoreet mattis enim Lorem ipsum dolor sit amet consectetur. 
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1 text-primary mt-4">
                <Text color={"primary"}>Show more </Text>
                <div className="mt-[2px]">
                  <AiOutlineDown size={20} />{" "}
                </div>
              </div>
        </div>
        </div>
      </div>
    </Container>
  );
};

export default Schedule;
