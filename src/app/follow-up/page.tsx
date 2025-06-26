"use client";

import Container from "~/_components/Container";
import * as React from "react";
import Box from "~/_components/Box";
import { useForm } from "react-hook-form";
import { Text } from "~/_components/Text";
import Image from "next/image";
import BoxGrid from "~/_components/BoxGrid";
import { RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  useGetAllAcademicYear,
  useGetAllGrades,
  useGetAllStudents,
  useGetSemesterByYear,
} from "~/APIs/hooks/useGrades";
import { useStudentUpcomingEvents } from "~/APIs/hooks/useEvents";
import {
  useGetAttendance,
  useGetDailyPlan,
  useGetGPA,
} from "~/APIs/hooks/useExam";
import { Skeleton } from "~/components/ui/Skeleton";
import Button from "~/_components/Button";
import { useRouter } from "next/navigation";
import useLanguageStore from "~/APIs/store";
import Spinner from "~/_components/Spinner";

/**
 * FollowUp component
 * ‑ يختار العام الدراسي (النشط) والفصل (أحدث ID) تلقائيًّا،
 * ‑ لا يعرض قوائم Select لهما بعد الآن.
 */
const FollowUp = () => {
  /* ------------------------------------------------------------------ */
  /* form & translations                                                */
  /* ------------------------------------------------------------------ */
  useForm({ shouldUnregister: false }); // ما زال غير مستخدَم لكن قد يفيد لاحقًا

  const t = (key: string) => {
    const language = useLanguageStore.getState().language;
    const translations: Record<string, Record<string, string>> = {
      points: { en: "Points", ar: "النقاط" },
      courseName: { en: "Course Name", ar: "اسم المقرر" },
      firstExam: { en: "First Exam", ar: "الاختبار الأول" },
      secondExam: { en: "Second Exam", ar: "الاختبار الثاني" },
      thirdExam: { en: "Third Exam", ar: "الاختبار الثالث" },
      fourthExam: { en: "Fourth Exam", ar: "الاختبار الرابع" },
      continuousAssessment: { en: "Continuous Assessment", ar: "التقييم المستمر" },
      coefficient: { en: "Coefficient", ar: "المعامل" },
      passedCourse: { en: "Passed", ar: "تم اجتيازه" },
      gpa: { en: "GPA", ar: "المعدل" },
      noGrades: { en: "No grades available", ar: "لا توجد درجات متاحة" },
      selectStudent: { en: "Select Student", ar: "اختر الطالب" },
    };
    return translations[key]?.[language] ?? key;
  };

  /* ------------------------------------------------------------------ */
  /* state                                                              */
  /* ------------------------------------------------------------------ */
  const [selectedYearId, setSelectedYearId] = React.useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<number | null>(null);
  const [selectedYearName, setSelectedYearName] = React.useState<string>("");
  const [selectedSemesterName, setSelectedSemesterName] = React.useState<string>("");
  const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /* queries                                                            */
  /* ------------------------------------------------------------------ */
  const { data: academicYears, isLoading: isAcademicYearsLoading } = useGetAllAcademicYear();
  const { data: semesters, isLoading: isSemestersLoading } = useGetSemesterByYear(
    selectedYearId ? selectedYearId.toString() : undefined,
  );
  const { data: students, isLoading: isStudentsLoading } = useGetAllStudents();
  const { data: eventsData, isLoading: isEvents } = useStudentUpcomingEvents(selectedStudent ?? "");
  const { data: gpaData, isLoading: isGpa } = useGetGPA(selectedStudent ?? "");
  const { data: attendanceData, isLoading: isAttendance } = useGetAttendance(selectedStudent ?? "");
  const { data: dailyPlanData, isLoading: isDaily } = useGetDailyPlan(selectedStudent ?? "");
  const { data: gradesData, isLoading: isLoadingGrades } = useGetAllGrades(
    selectedSemesterId?.toString() ?? "",
    selectedStudent ?? "",
  );

  /* ------------------------------------------------------------------ */
  /* effects: pick active year & latest semester                        */
  /* ------------------------------------------------------------------ */
  React.useEffect(() => {
    if (academicYears?.data?.length) {
      const active = academicYears.data.find((y: any) => y.active);
      if (active) {
        setSelectedYearId(active.id);
        setSelectedYearName(active.name);
      }
    }
  }, [academicYears]);

  React.useEffect(() => {
    if (semesters?.data?.length) {
      const latest = semesters.data.reduce((max: any, s: any) => (s.id > max.id ? s : max), semesters.data[0]);
      setSelectedSemesterId(latest.id);
      setSelectedSemesterName(latest.name);
    }
  }, [semesters]);

  const router = useRouter();

  /* ------------------------------------------------------------------ */
  /* render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <Container>
      {/* -------------------------------------------------------------- */}
      {/* Student selector + add child                                  */}
      {/* -------------------------------------------------------------- */}
      <div className="mb-8 flex justify-between gap-4">
        <Select value={selectedStudent ?? ""} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[250px] border border-border bg-bgPrimary">
            <SelectValue placeholder={t("selectStudent")} />
          </SelectTrigger>
          {students?.data?.length && (
            <SelectContent>
              {students.data.map((student: any) => (
                <SelectItem key={student.studentId} value={student.studentId.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
        <div className="flex justify-end">
        <Button onClick={() => router.push("/add-child")}>Add Another Child</Button>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Main content: requires student selected                        */}
      {/* -------------------------------------------------------------- */}
      {selectedStudent ? (
        <>
          {/* ---------- overview boxes ---------- */}
          <BoxGrid>
            {/* Student info */}
            <Box>
              <div className="flex justify-between py-2">
                <div className="flex gap-6">
                  <Image src="/images/userr.png" alt="student Photo" width={75} height={75} />
                  <div>
                    <Text font="bold" size="xl">
                      {students?.data?.find((s: any) => s.studentId.toString() === selectedStudent)?.name}
                    </Text>
                    <Text color="gray" font="semiBold" className="mt-4">
                      @
                      {students?.data
                        ?.find((s: any) => s.studentId.toString() === selectedStudent)
                        ?.name.toLowerCase()
                        .replace(/\s+/g, "_")}
                    </Text>
                  </div>
                </div>
                <Text font="bold" color="gray">
                  {students?.data?.find((s: any) => s.studentId.toString() === selectedStudent)?.grade}
                </Text>
              </div>
            </Box>

            {/* Daily plan */}
            <Box>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Text font="bold" size="xl">Daily plan</Text>
                  {isDaily ? (
                    <Skeleton className="mt-4 h-6 w-32" />
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <Text font="bold" color={dailyPlanData?.data > 0 ? "success" : "error"} size="xl">
                        {dailyPlanData?.data}%
                      </Text>
                      {dailyPlanData?.data > 0 && (
                        <Image src="/images/winner.png" alt="winner" width={20} height={20} />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Text color="primary" font="semiBold">
                    <Link href={`/follow-up/${selectedStudent}`}>Show details</Link>
                  </Text>
                  <RiArrowRightSLine className="text-primary" size={25} />
                </div>
              </div>
            </Box>

            {/* Upcoming Events */}
            <Box>
              <Text font="bold" size="xl">Upcoming Events</Text>
              {isEvents ? (
                <Skeleton className="mt-4 h-12 w-full" />
              ) : eventsData?.data?.content?.length ? (
                eventsData.data.content.map((event: any) => (
                  <div key={event.id} className="mt-4 flex justify-between border-l-4 border-info p-4">
                    <div>
                      <Text>{event.title}</Text>
                      <Text color="gray">{event.day}</Text>
                    </div>
                    <div className="flex flex-col items-end">
                      <Text>{event.time}</Text>
                      <Text>{event.date}</Text>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Image src="/images/no-events.png" alt="No Events" width={150} height={150} className="mb-4 block dark:hidden" />
                  <Image src="/images/no-events-dark.png" alt="No Events" width={150} height={150} className="mb-4 hidden dark:block" />
                  <Text color="gray" font="semiBold" size="lg" className="text-center">
                    There are no Upcoming Events
                  </Text>
                </div>
              )}
            </Box>

            {/* Academic progress */}
            <Box>
              <Text font="bold" size="xl">Academic Progress</Text>
              <Text font="bold" color="gray">This Semester</Text>
              <BoxGrid className="mt-4">
                {isGpa ? (
                  <Skeleton className="mt-4 h-6 w-32" />
                ) : (
                  <Box shadow="md">
                    <Text color="gray">GPA</Text>
                    <Text font="semiBold">{gpaData?.currentGpa}</Text>
                    <Text color={gpaData?.percentageDifference > 0 ? "success" : "error"}>
                      {gpaData?.percentageDifference}
                    </Text>
                  </Box>
                )}
                {isAttendance ? (
                  <Skeleton className="mt-4 h-6 w-32" />
                ) : (
                  <Box shadow="md">
                    <Text color="gray">Attendance</Text>
                    <Text font="semiBold">{attendanceData?.currentAttendance}%</Text>
                    <Text color={attendanceData?.percentageDifference > 0 ? "success" : "error"}>
                      {attendanceData?.percentageDifference}%
                    </Text>
                  </Box>
                )}
              </BoxGrid>
            </Box>
          </BoxGrid>

          {/* ---------- Grade book ---------- */}
          <div className="mt-6">
            <Box>
              <Text font="bold" size="xl">Grade Book</Text>

              {/* Display chosen academic year & semester */}
              <div className="mt-2 flex flex-wrap gap-4 text-textPrimary">
                {selectedYearName && (
                  <div className="rounded-md bg-bgSecondary px-3 py-1">
                    <Text font="semiBold">{selectedYearName}</Text>
                  </div>
                )}
                {selectedSemesterName && (
                  <div className="rounded-md bg-bgSecondary px-3 py-1">
                    <Text font="semiBold">{selectedSemesterName}</Text>
                  </div>
                )}
              </div>

              {isAcademicYearsLoading || isStudentsLoading || isSemestersLoading || isLoadingGrades ? (
                <div className="flex w-full justify-center">
                  <Spinner />
                </div>
              ) : (
                <table className="w-full border-separate border-spacing-y-2 overflow-x-auto p-4 text-left text-sm text-textPrimary">
                  <thead className="text-xs uppercase text-textPrimary">
                    <tr>
                      <th className="whitespace-nowrap px-6 py-3">{t("points")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("courseName")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("firstExam")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("secondExam")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("thirdExam")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("fourthExam")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("continuousAssessment")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("coefficient")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("passedCourse")}</th>
                      <th className="whitespace-nowrap px-6 py-3">{t("gpa")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesData?.courses?.length ? (
                      gradesData.courses.map((grade: any, idx: number) => (
                        <tr key={idx} className="bg-bgSecondary font-semibold hover:bg-primary hover:text-white">
                          <td className="whitespace-nowrap rounded-s-2xl px-6 py-4 text-textSecondary">{grade.points ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.courseName ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.firstExamScore ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.secondExamScore ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.thirdExamScore ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.fourthExamScore ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.continuousAssessment ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.coefficient ?? "-"}</td>
                          <td className="whitespace-nowrap px-6 py-4">{grade.passedCourse ?? "-"}</td>
                          <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">{grade.gpa ?? "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-bgSecondary font-semibold hover:bg-primary hover:text-white">
                        <td colSpan={10} className="rounded-2xl px-6 py-4 text-center text-textSecondary">
                          {t("noGrades")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </Box>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <Text font="semiBold" size="xl">{t("selectStudent")}</Text>
        </div>
      )}
    </Container>
  );
};

export default FollowUp;
