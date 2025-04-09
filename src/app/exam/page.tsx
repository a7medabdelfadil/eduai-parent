"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Button from "~/_components/Button";
import Container from "~/_components/Container";
import Spinner from "~/_components/Spinner";
import { Text } from "~/_components/Text";
import {
  useGetPreviousExamsByStudentId,
  useGetUpcomingExamsByStudentId,
} from "~/APIs/hooks/useExam";
import { useGetStudentsSimpleData } from "~/APIs/hooks/useStudent";
import useLanguageStore from "~/APIs/store";
import { type ExamById, type StudentSimpleData } from "~/types";
import { IoSearchOutline } from "react-icons/io5";
import { IoOptionsOutline } from "react-icons/io5";
import { Skeleton } from "~/components/ui/Skeleton";

const Exam = () => {
  const [search, setSearch] = useState("");

  const { data: dataStudents, isLoading: isLoadingStudents } =
    useGetStudentsSimpleData();
  console.log("👾 ~ Exam ~ isLoadingStudents:", isLoadingStudents);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [viewMode, setViewMode] = useState<"previous" | "upcoming">("previous");

  const { data: dataUpcomingExams, isLoading: isLoadingUpcomingExams } =
    useGetUpcomingExamsByStudentId(selectedStudentId || "");
  const { data: dataPreviousExams, isLoading: isLoadingPreviousExams } =
    useGetPreviousExamsByStudentId(selectedStudentId || "");

  const handleSelectExam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(event.target.value);
  };
  const language = useLanguageStore((state) => state.language);

  const translate = (en: string, fr: string, ar: string) => {
    return language === "fr" ? fr : language === "ar" ? ar : en;
  };

  if (isLoadingStudents) {
    return (
      <Container>
        <div className="flex h-[500px] w-full items-center justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  const renderExams = (data: any, type: "Previous" | "Upcoming") => {
    const filteredData = data?.filter((exam: ExamById) =>
      exam.courseName.toLowerCase().includes(search.toLowerCase()),
    );

    if (!filteredData || filteredData.length === 0) {
      return (
        <Text font="semiBold" size="xl">
          {translate(
            `No ${type.toLowerCase()} exams found for the selected student.`,
            `Aucun examen ${type.toLowerCase()} trouvé pour l'étudiant sélectionné.`,
            `لا توجد اختبارات ${type === "Previous" ? "سابقة" : "قادمة"} للطالب المحدد.`,
          )}
        </Text>
      );
    }

    return (
      <div className="relative w-full overflow-auto sm:rounded-lg">
        <table className="w-full border-separate border-spacing-y-2 overflow-x-auto px-4 text-left text-sm text-textPrimary">
          <thead className="text-xs uppercase text-textPrimary">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate("Title", "Titre", "العنوان")}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate("Score", "Score", "الدرجة")}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate("Class", "Classe", "الصف")}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate("Exam Type", "Type d'examen", "نوع الاختبار")}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate(
                  "Exam Beginning",
                  "Début de l'examen",
                  "بداية الاختبار",
                )}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate("Exam Ending", "Fin de l'examen", "نهاية الاختبار")}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {translate("Exam Date", "Date de l'examen", "تاريخ الاختبار")}
              </th>
            </tr>
          </thead>
          <tbody className="rounded-lg">
            {filteredData?.map((exam: ExamById, index: number) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } font-semibold hover:bg-primary hover:text-white`}
              >
                <th
                  scope="row"
                  className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium text-textSecondary"
                >
                  {exam.courseName}
                </th>
                <td className="whitespace-nowrap px-6 py-4">
                  {exam.examGrade}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {exam.className}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {exam.examTypeName}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {exam.examBeginning}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {exam.examEnding}
                </td>
                <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">
                  {exam.examDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Container>
        <div className="flex w-full items-start justify-between gap-7 md:items-center">
          <div className="flex w-1/2 flex-col items-center gap-10 md:w-[400px] md:flex-row">
            <Button
              className="md:text-md text-sm"
              theme={viewMode === "previous" ? "solid" : "outline"}
              onClick={() => setViewMode("previous")}
            >
              {translate(
                "Previous Exams",
                "Examens précédents",
                "الاختبارات السابقة",
              )}
            </Button>
            <Button
              className="md:text-md text-sm"
              theme={viewMode === "upcoming" ? "solid" : "outline"}
              onClick={() => setViewMode("upcoming")}
            >
              {translate(
                "Upcoming Exams",
                "Examens à venir",
                "الاختبارات القادمة",
              )}
            </Button>
          </div>

          <div className="flex w-1/2 md:w-[300px]">
            <select
              className="md:text-md flex w-full items-center gap-3 whitespace-nowrap rounded-xl bg-bgPrimary px-6 py-4 text-sm font-semibold outline-none duration-200 ease-in hover:shadow-lg"
              onChange={handleSelectExam}
            >
              <option value="">
                {translate(
                  "Select Student",
                  "Sélectionner un étudiant",
                  "اختر الطالب",
                )}
              </option>
              {dataStudents?.data.map((student: StudentSimpleData) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10 w-full rounded-lg bg-bgPrimary">
          {selectedStudentId ? (
            <>
              <div className="flex w-full items-center justify-between p-4">
                <Text font="bold" size="2xl">
                  {translate(
                    viewMode === "previous"
                      ? "Previous Exams"
                      : "Upcoming Exams",
                    viewMode === "previous"
                      ? "Examens précédents"
                      : "Examens à venir",
                    viewMode === "previous"
                      ? "الاختبارات السابقة"
                      : "الاختبارات القادمة",
                  )}
                </Text>
                <div className="flex gap-2">
                  <div className="mb-3 hidden md:block">
                    <label htmlFor="icon" className="sr-only">
                      Search
                    </label>
                    <div className="relative min-w-72 md:min-w-80">
                      <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                        <IoSearchOutline
                          className="text-powderBlue"
                          size={24}
                        />
                      </div>

                      <input
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        id="icon"
                        name="icon"
                        className="border-powderBlue block w-full rounded-lg border px-4 py-2 ps-11 text-lg outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                        placeholder={
                          language === "ar"
                            ? "ابحث "
                            : language === "fr"
                              ? "Rechercher"
                              : "Search"
                        }
                      />
                    </div>
                  </div>
                  <IoOptionsOutline
                    className="border-powderBlue rounded-lg border p-2 text-primary"
                    size={46}
                  />
                </div>
              </div>

              <div className="w-full overflow-auto rounded-md bg-bgPrimary px-4 pb-8">
                {(viewMode === "previous" && isLoadingPreviousExams) ||
                (viewMode === "upcoming" && isLoadingUpcomingExams) ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                ) : viewMode === "previous" ? (
                  renderExams(dataPreviousExams?.data, "Previous")
                ) : (
                  renderExams(dataUpcomingExams?.data, "Upcoming")
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4">
              <Text font="semiBold" size="xl">
                {translate(
                  "Select a student to view their exams",
                  "Sélectionnez un étudiant pour voir ses examens",
                  "اختر الطالب لعرض اختباراته",
                )}
              </Text>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Exam;
