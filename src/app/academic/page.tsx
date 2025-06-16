"use client";
/* eslint-disable @next/next/no-img-element */
import Container from "~/_components/Container";
import * as React from "react";
import { Calendar } from "~/components/ui/calendar";
import { Text } from "~/_components/Text";
import { format } from "date-fns";
import Box from "~/_components/Box";
import BoxGrid from "~/_components/BoxGrid";
import { PiLineVertical } from "react-icons/pi";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useGetAllStudents } from "~/APIs/hooks/useGrades";
import {
  useGetAllAttendances,
  useGetAllAttendancesSumm,
  useGetAllHomeWorks,
  useGetAllMaterials,
  useGetAllSchedule,
} from "~/APIs/hooks/useHomeWork";
import useLanguageStore from "~/APIs/store";
import { Skeleton } from "~/components/ui/Skeleton";

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
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(
    undefined,
  );
  const { data: students, isLoading: isStudents } = useGetAllStudents();

  const formattedDate = React.useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate],
  );
  console.log("👾 ~ Schedule ~ formattedDate:", formattedDate)

  const language = useLanguageStore((state) => state.language);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      selectStudent: {
        en: "Select Student",
        ar: "اختر الطالب",
        fr: "Sélectionnez un étudiant",
      },
      todayClasses: {
        en: "Today Classes",
        ar: "حصص اليوم",
        fr: "Cours d'aujourd'hui",
      },
      subject: {
        en: "Subject",
        ar: "الموضوع",
        fr: "Sujet",
      },
      teacher: {
        en: "Teacher",
        ar: "المعلم",
        fr: "Enseignant",
      },
      time: {
        en: "Time",
        ar: "الوقت",
        fr: "Heure",
      },
      day: {
        en: "Day",
        ar: "اليوم",
        fr: "Jour",
      },
      noHomework: {
        en: "No homework assigned for this date",
        ar: "لا توجد واجبات منزلية لهذا التاريخ",
        fr: "Aucun devoir assigné pour cette date",
      },
      noMaterials: {
        en: "No materials assigned for this date",
        ar: "لا توجد مواد لهذا التاريخ",
        fr: "Aucun matériel assigné pour cette date",
      },
      todayAttendance: {
        en: "Today's Attendance",
        ar: "حضور اليوم",
        fr: "Présence d'aujourd'hui",
      },
      attendanceSummary: {
        en: "Attendance Summary",
        ar: "ملخص الحضور",
        fr: "Résumé de la présence",
      },
      last30Days: {
        en: "Last 30 Days",
        ar: "آخر 30 يومًا",
        fr: "Les 30 derniers jours",
      },
      totalClasses: {
        en: "Total Classes",
        ar: "إجمالي الحصص",
        fr: "Total des cours",
      },
      presence: {
        en: "Presence",
        ar: "الحضور",
        fr: "Présence",
      },
      absence: {
        en: "Absence",
        ar: "الغياب",
        fr: "Absence",
      },
      late: {
        en: "Late",
        ar: "متأخر",
        fr: "En retard",
      },
      todayMaterials: {
        en: "Today's Materials",
        ar: "مواد اليوم",
        fr: "Matériaux d'aujourd'hui",
      },
      todayHomework: {
        en: "Today's Homework",
        ar: "واجب اليوم",
        fr: "Devoirs d'aujourd'hui",
      },
    };

    return translations[key]?.[language] ?? key;
  };

  const { data: homeworks, isLoading: isHomeworksLoading } = useGetAllHomeWorks(
    selectedStudent,
    formattedDate,
  );
  const { data: materials, isLoading: isMaterials } = useGetAllMaterials(
    selectedStudent,
    formattedDate,
  );
  const { data: attendance } = useGetAllAttendances(
    selectedStudent,
    formattedDate,
  );
  const { data: attendanceSumm } = useGetAllAttendancesSumm(selectedStudent);
  const { data: schedule } = useGetAllSchedule(selectedStudent, formattedDate);

  useEffect(() => {
    if (students?.data?.length && !selectedStudent) {
      setSelectedStudent(students.data[0].studentId.toString());
    }
  }, [students?.data, selectedStudent]);

  return (
    <Container>
      <div className="mb-5 flex w-full">
        <Select
          value={selectedStudent ?? ""}
          onValueChange={setSelectedStudent}
        >
          <SelectTrigger className="w-[250px] border border-borderSecondary outline-none bg-bgPrimary">
            <SelectValue placeholder={t("selectStudent")} />
          </SelectTrigger>
          {students?.data?.length && (
            <SelectContent>
              {students?.data?.map((student: any) => (
                <SelectItem
                  key={student.studentId}
                  value={student.studentId.toString()}
                >
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
      </div>

      <div className="mb-4 flex w-full gap-6 max-[1080px]:grid">
        <div className="flex overflow-auto md:overflow-visible">
          <CalendarDemo onDateSelect={setSelectedDate} />
        </div>

        <Box className="overflow-auto">
          <Text font={"semiBold"} size={"xl"} className="mb-3">
            {t("todayClasses")}
          </Text>

          <table className="w-full border-separate border-spacing-y-2 overflow-x-auto p-4 text-left text-sm">
            <thead className="text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {t("subject")}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {t("teacher")}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {t("time")}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {t("day")}
                </th>
              </tr>
            </thead>
            <tbody className="rounded-lg">
              {schedule?.data?.length
                ? schedule.data.map((item: any) => (
                    <tr
                      key={item.id}
                      className="bg-bgSecondary font-semibold transition hover:bg-primary hover:text-white"
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium"
                      >
                        {item.courseName}
                      </th>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.teacherName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.startTime} - {item.endTime}
                      </td>
                      <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">
                        {item.day}
                      </td>
                    </tr>
                  ))
                : [...Array(3)].map((_, i) => (
                    <tr key={i} className="bg-bgSecondary">
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Box>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="h-fit w-full rounded-xl bg-bgPrimary p-4 shadow lg:w-2/5">
          <Text font={"bold"} size={"xl"}>
            {t("todayAttendance")}
          </Text>
          <Text font={"bold"} size={"lg"} className="mt-4">
            {t("attendanceSummary")}
          </Text>
          <Text font={"semiBold"} color={"gray"} className="mb-4">
            {t("last30Days")}
          </Text>
          <BoxGrid>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                {t("totalClasses")}
              </Text>
              {attendanceSumm ? (
                <Text font={"semiBold"}>
                  {attendanceSumm?.data?.numberOfAttendances}
                </Text>
              ) : (
                <Skeleton className="h-5 w-10 rounded-md" />
              )}
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                {t("presence")}
              </Text>
              {attendanceSumm ? (
                <Text font={"semiBold"}>
                  {attendanceSumm?.data?.numberOfPresentAttendances}
                </Text>
              ) : (
                <Skeleton className="h-5 w-10 rounded-md" />
              )}
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                {t("absence")}
              </Text>
              {attendanceSumm ? (
                <Text font={"semiBold"}>
                  {attendanceSumm?.data?.numberOfAbsentAttendances}
                </Text>
              ) : (
                <Skeleton className="h-5 w-10 rounded-md" />
              )}
            </Box>
            <Box border="borderPrimary">
              <Text font={"semiBold"} color={"gray"}>
                {t("late")}
              </Text>
              {attendanceSumm ? (
                <Text font={"semiBold"}>
                  {attendanceSumm?.data?.numberOfLateAttendances}
                </Text>
              ) : (
                <Skeleton className="h-5 w-10 rounded-md" />
              )}
            </Box>
          </BoxGrid>
        </div>

        <div className="grid h-full w-full gap-6">
          <div className="h-fit w-full rounded-xl bg-bgPrimary p-4 shadow">
            <Text font={"bold"} size={"xl"} className="mb-8">
              {t("todayMaterials")}
            </Text>
            <div>
              {isMaterials ? (
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
              ) : materials?.data?.content?.length ? (
                materials.data?.content?.map((material: any, index: number) => (
                  <div key={index} className="mt-4">
                    <Text size={"xl"} className="mb-2">
                      {material.courseName}
                    </Text>
                    <div className="flex rounded-xl border border-borderPrimary p-2">
                      <PiLineVertical
                        size={125}
                        className="-ml-12 text-primary"
                      />
                      <div className="-ml-10 mt-2 w-[90%]">
                        <Text size={"xl"}>{material.courseName}</Text>
                        <Text size={"md"}>{material.startTime}</Text>
                        <Text size={"md"}>{material.endTime}</Text>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Text color={"gray"} size={"lg"} font={"medium"} className="-mt-4">{t("noMaterials")}</Text>
              )}
            </div>
          </div>

          <div className="h-fit w-full rounded-xl bg-bgPrimary p-4 shadow">
            <Text font={"bold"} size={"xl"} className="mb-8">
              {t("todayHomework")}
            </Text>
            <div>
              {isHomeworksLoading ? (
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
              ) : homeworks?.data?.content?.length ? (
                homeworks.data?.content?.map((homework: any, index: number) => (
                  <div key={homework.id} className={index > 0 ? "mt-4" : ""}>
                    <div className="flex rounded-xl border border-borderPrimary p-2">
                      <PiLineVertical
                        size={125}
                        className="-ml-12 text-primary"
                      />
                      <div className="-ml-10 mt-2 w-[90%]">
                        <Text size={"xl"} font={"medium"}>
                          {homework.title}
                        </Text>
                        <Text size={"lg"}>{homework.courseName}</Text>
                        <Text
                          font={"semiBold"}
                          color={homework.done ? "success" : "error"}
                        >
                          Deadline:{" "}
                          {format(new Date(homework.deadline), "dd MMM (EEEE)")}
                        </Text>
                        <Text color={"gray"} className="my-1">
                          {homework.description}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Text  color={"gray"} size={"lg"} font={"medium"} className="-mt-4">{t("noHomework")}</Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Schedule;
