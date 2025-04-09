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
import { ExamById, StudentSimpleData } from "~/types";

const Exam = () => {
  const { data: dataStudents, isLoading: isLoadingStudents } = useGetStudentsSimpleData();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [viewMode, setViewMode] = useState<"previous" | "upcoming">("previous");

  const { data: dataUpcomingExams, isLoading: isLoadingUpcomingExams } = useGetUpcomingExamsByStudentId(selectedStudentId || "");
  const { data: dataPreviousExams, isLoading: isLoadingPreviousExams } = useGetPreviousExamsByStudentId(selectedStudentId || "");

  const handleSelectExam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(event.target.value);
  };

  const renderExams = (data: any, type: "Previous" | "Upcoming") => {
    if (!data || data.length === 0) {
      return (
        <Text font="semiBold" size="xl">
          No {type.toLowerCase()} exams found for the selected student.
        </Text>
      );
    }

    return (
      <div className="relative w-full overflow-auto sm:rounded-lg">
        <Text font="bold" size="2xl" className="mb-4">
          {type} Exams
        </Text>
        <table className="w-full border-separate border-spacing-y-2 overflow-x-auto p-4 text-left text-sm text-textPrimary">
          <thead className="text-xs uppercase text-textPrimary">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Title
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Score
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Class
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Exam Type
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Exam Beginning
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Exam Ending
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Exam Date
              </th>
            </tr>
          </thead>
          <tbody className="rounded-lg">
            {data?.map((exam: ExamById, index: number) => (
              <tr
                key={index}
                className="bg-bgSecondary font-semibold hover:bg-primary hover:text-white"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium text-textSecondary"
                >
                  {exam.courseName}
                </th>
                <td className="whitespace-nowrap px-6 py-4">{exam.examGrade}</td>
                <td className="whitespace-nowrap px-6 py-4">{exam.className}</td>
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

  // Show loading text if any data is still loading
  if (isLoadingStudents || isLoadingUpcomingExams || isLoadingPreviousExams) {
    return (
      <Container>
        <div className="flex w-full h-[500px] items-center justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
   <div> 
     <Container>
      <div className="flex w-full items-start md:items-center justify-between gap-7">
        <div className="flex w-1/2 md:w-[400px] flex-col md:flex-row items-center gap-10">
          <Button
            className="text-sm md:text-md"
            theme={viewMode === "previous" ? "solid" : "outline"}
            onClick={() => setViewMode("previous")}
          >
            Previous Exams
          </Button>
          <Button
            className="text-sm md:text-md"
            theme={viewMode === "upcoming" ? "solid" : "outline"}
            onClick={() => setViewMode("upcoming")}
          >
            Upcoming Exams
          </Button>
        </div>

        <div className="flex w-1/2 md:w-[300px]">
          <select
            className="flex w-full text-sm md:text-md items-center gap-3 whitespace-nowrap rounded-xl bg-bgPrimary px-6 py-4 font-semibold outline-none duration-200 ease-in hover:shadow-lg"
            onChange={handleSelectExam}
          >
            <option value="">Select Student</option>
            {dataStudents?.data.map((student: StudentSimpleData) => (
              <option key={student.studentId} value={student.studentId}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 flex h-full w-full items-center justify-center">
        <div className="flex w-full overflow-auto rounded-md bg-bgPrimary p-4">
          {selectedStudentId ? (
            viewMode === "previous"
              ? renderExams(dataPreviousExams?.data, "Previous")
              : renderExams(dataUpcomingExams?.data, "Upcoming")
          ) : (
            <Text font="semiBold" size="xl">
              Select a student to view their exams
            </Text>
          )}
        </div>
      </div>
    </Container>
   </div>
  );
};

export default Exam;
