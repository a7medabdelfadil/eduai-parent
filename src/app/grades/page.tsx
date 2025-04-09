"use client"
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Container from "~/_components/Container";
import Spinner from "~/_components/Spinner";
import { Text } from "~/_components/Text";
import { 
  useGetAllAcademicYear, 
  useGetSemesterByYear, 
  useGetAllGrades,
  useGetAllStudents,
} from "~/APIs/hooks/useGrades";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const Grades = () => {
  // State for selections
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Fetch hooks
  const { data: academicYears, isLoading: isLoadingYears } = useGetAllAcademicYear();
  const { data: students, isLoading: isStudents } = useGetAllStudents();
  const { data: semesters, isLoading: isLoadingSemesters } = useGetSemesterByYear(
    selectedAcademicYear ?? ""
  );
  const { data: gradesData, isLoading: isLoadingGrades } = useGetAllGrades(
    selectedSemester ?? "",
    selectedStudent ?? "", 
  );

  return (
    <Container>
      <div className="flex w-full items-center justify-between gap-4">
        {/* Academic Year Select */}
        <Select 
          value={selectedAcademicYear || ""} 
          onValueChange={setSelectedAcademicYear}
        >
          <SelectTrigger className={`w-full border bg-white border-[#f0efef]`}>
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>
          <SelectContent>
            {academicYears?.data?.map((year: any) => (
              <SelectItem key={year.id} value={year.id.toString()}>
                {year.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Semester Select */}
        <Select 
          value={selectedSemester ?? ""} 
          onValueChange={setSelectedSemester}
          disabled={!selectedAcademicYear}
        >
          <SelectTrigger className={`w-full border bg-white border-[#f0efef]`}>
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters?.data?.map((semester:any) => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Student Select */}
        <Select 
          value={selectedStudent ?? ""} 
          onValueChange={setSelectedStudent}
          disabled={!selectedSemester}
        >
          <SelectTrigger className={`w-full border bg-white border-[#f0efef]`}>
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          {students?.data?.length && (
          <SelectContent>
            {students?.data?.map((student:any)=>(
              <SelectItem key={student.studentId} value={student.studentId.toString()}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>)}
        </Select>
      </div>

      <div className="mt-10 flex h-full w-full items-center justify-center">
        <div className="flex w-full rounded-md bg-bgPrimary p-4">
          <div className="relative w-full overflow-x-auto sm:rounded-lg">
            <Text font="bold" size="2xl" className="mb-4">
              Continuous Evaluation Scores
            </Text>
            
            {/* Loading and Empty States */}
            {isLoadingYears || isStudents || isLoadingSemesters || isLoadingGrades ? (
              <div className="flex w-full justify-center">
              <Spinner />
            </div>
            ) : (
              <table className="w-full overflow-x-auto p-4 text-left text-sm text-textPrimary border-separate border-spacing-y-2">
                <thead className="text-textPrimary text-xs uppercase">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">points</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">course Name</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">first Exam Score</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">second Exam Score</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">third Exam Score</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">fourth Exam Score</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">continuous Assessment</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">coefficient</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">passed Course</th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">gpa</th>
                  </tr>
                </thead>
                <tbody className="rounded-lg">
                  {gradesData?.courses?.length ? (
                    gradesData.courses?.map((grade:any, index:any) => (
                      <tr 
                        key={index} 
                        className="bg-bgSecondary font-semibold hover:bg-primary hover:text-white"
                      >
                        <th scope="row" className="whitespace-nowrap rounded-s-2xl px-6 py-4 font-medium text-textSecondary">
                          {grade.points || '-'}
                        </th>
                        <td className="whitespace-nowrap px-6 py-4">{grade.courseName || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.firstExamScore || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.secondExamScore || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.thirdExamScore || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.fourthExamScore || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.continuousAssessment || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.coefficient || '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4">{grade.passedCourse || '-'}</td>
                        <td className="whitespace-nowrap rounded-e-2xl px-6 py-4">
                          {grade.gpa || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-bgSecondary font-semibold hover:bg-primary hover:text-white">
                      <th
                        colSpan={10}
                        className="text-center whitespace-nowrap rounded-2xl px-6 py-4 font-medium text-textSecondary "
                      >
                        No grades found
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            <span className="flex gap-2">
              <p className="font-semibold">Average</p>
              <p className="">{gradesData?.averageOfThisSemester || '-'}</p>
            </span>
            <span className="flex gap-2">
              <p className="font-semibold">Total Coefficient</p>
              <p className="">{gradesData?.totalCoefficient || '-'}</p>
            </span>
            <span className="flex gap-2">
              <p className="font-semibold">Total GPA</p>
              <p className="">{gradesData?.totalGPA || '-'}</p>
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Grades;