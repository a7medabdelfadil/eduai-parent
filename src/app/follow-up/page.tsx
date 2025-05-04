"use client";
import Container from "~/_components/Container";
import * as React from "react";
import Box from "~/_components/Box";
import { useForm } from "react-hook-form";
import { Text } from "~/_components/Text";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
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
import { useGetAllStudents } from "~/APIs/hooks/useGrades";
import { useStudentUpcomingEvents } from "~/APIs/hooks/useEvents";
import {
  useGetAttendance,
  useGetDailyPlan,
  useGetGPA,
} from "~/APIs/hooks/useExam";
import { Skeleton } from "~/components/ui/Skeleton";
import Button from "~/_components/Button";

const FollowUp = () => {
  const { control } = useForm({
    shouldUnregister: false,
  });

  const names = [
    {
      value: "name-1",
      label: "Name 1",
    },
    {
      value: "name-2",
      label: "Name 2",
    },
  ];

  const [selectedGrade, setSelectedGrade] = useState<string>("mathematics");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { data, isLoading } = useStudentUpcomingEvents(selectedStudent ?? "");
  const { data: Gpa, isLoading: isGpa } = useGetGPA(selectedStudent ?? "");
  const { data: attend, isLoading: isAttend } = useGetAttendance(
    selectedStudent ?? "",
  );
  const { data: daily, isLoading: isDaily } = useGetDailyPlan(
    selectedStudent ?? "",
  );
  const { data: students, isLoading: isStudents } = useGetAllStudents();
  const subjects = [
    {
      value: "mathematics",
      label: "Mathematics",
      score: 80.5,
      assignments: [
        { name: "HomeWork1", score: 81, weight: 10 },
        { name: "Quiz1", score: 81, weight: 10 },
        { name: "Midterm Exam", score: 81, weight: 10 },
        { name: "Project", score: 81, weight: 10 },
        { name: "Final Exam", score: 81, weight: 10 },
      ],
      historicalAssignments: [
        { name: "Spring Term - 2024", score: 80 },
        { name: "Winter Term - 2024", score: 80 },
        { name: "Spring Term - 2023", score: 80 },
      ],
      teacherComments: [
        {
          name: "Mahmoud Alaa Eldeen",
          imgUrl: "/images/userr.png",
          comment: "Great improvement in the project. Keep up the good work!",
        },
      ],
    },
    {
      value: "english",
      label: "English",
      score: 85.2,
      assignments: [
        { name: "HomeWork1", score: 90, weight: 10 },
        { name: "Quiz1", score: 85, weight: 10 },
        { name: "Midterm Exam", score: 83, weight: 10 },
        { name: "Project", score: 87, weight: 10 },
        { name: "Final Exam", score: 88, weight: 10 },
      ],
      historicalAssignments: [
        { name: "Spring Term - 2024", score: 87 },
        { name: "Winter Term - 2024", score: 86 },
        { name: "Spring Term - 2023", score: 84 },
      ],
      teacherComments: [
        {
          name: "Teacher 2",
          imgUrl: "/images/userr.png",
          comment: "Well done, keep it up!",
        },
      ],
    },
    {
      value: "history",
      label: "History",
      score: 75.8,
      assignments: [
        { name: "HomeWork1", score: 78, weight: 10 },
        { name: "Quiz1", score: 70, weight: 10 },
        { name: "Midterm Exam", score: 75, weight: 10 },
        { name: "Project", score: 77, weight: 10 },
        { name: "Final Exam", score: 80, weight: 10 },
      ],
      historicalAssignments: [
        { name: "Spring Term - 2024", score: 74 },
        { name: "Winter Term - 2024", score: 72 },
        { name: "Spring Term - 2023", score: 76 },
      ],
      teacherComments: [
        {
          name: "Teacher 3",
          imgUrl: "/images/userr.png",
          comment: "You can improve with more effort.",
        },
      ],
    },
    {
      value: "french",
      label: "French",
      score: 90.1,
      assignments: [
        { name: "HomeWork1", score: 92, weight: 10 },
        { name: "Quiz1", score: 89, weight: 10 },
        { name: "Midterm Exam", score: 94, weight: 10 },
        { name: "Project", score: 90, weight: 10 },
        { name: "Final Exam", score: 93, weight: 10 },
      ],
      historicalAssignments: [
        { name: "Spring Term - 2024", score: 92 },
        { name: "Winter Term - 2024", score: 91 },
        { name: "Spring Term - 2023", score: 90 },
      ],
      teacherComments: [
        {
          name: "Teacher 4",
          imgUrl: "/images/userr.png",
          comment: "Excellent work, keep it up!",
        },
      ],
    },
  ];

  const handleGradeChange = (gradeValue: string) => {
    setSelectedGrade(gradeValue);
  };

  // Get the selected subject data
  const selectedSubject = subjects.find(
    (subject) => subject.value === selectedGrade,
  );

  return (
    <Container>
      <div className="mb-8 flex justify-between gap-4">
        <div>
          <Select
            value={selectedStudent ?? ""}
            onValueChange={setSelectedStudent}
          >
            <SelectTrigger
              className={`w-[250px] border border-border bg-bgPrimary`}
            >
              <SelectValue placeholder="Select Student" />
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
        <div>
          <Button>Add Another Child</Button>
        </div>
      </div>
      {selectedStudent ? (
        <>
          <BoxGrid>
            <Box>
              <div className="flex justify-between py-2">
                {selectedStudent === null ? (
                  <Text>Select Student</Text>
                ) : (
                  <>
                    <div className="flex gap-6">
                      <div>
                        <Image
                          src={"/images/userr.png"}
                          alt="student Photo"
                          width={75}
                          height={75}
                        />
                      </div>
                      <div>
                        <Text font={"bold"} size={"xl"}>
                          {
                            students?.data?.find(
                              (student: any) =>
                                student.studentId.toString() ===
                                selectedStudent,
                            )?.name
                          }
                        </Text>
                        <Text color={"gray"} font={"semiBold"} className="mt-4">
                          @
                          {students?.data
                            ?.find(
                              (student: any) =>
                                student.studentId.toString() ===
                                selectedStudent,
                            )
                            ?.name.toLowerCase()
                            .replace(/\s+/g, "_")}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text font={"bold"} color={"gray"}>
                        {
                          students?.data?.find(
                            (student: any) =>
                              student.studentId.toString() === selectedStudent,
                          )?.grade
                        }
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </Box>
            <Box>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Text font={"bold"} size={"xl"}>
                    Daily plan
                  </Text>
                  {isDaily ? (
                    <div className="flex items-center justify-between py-2">
                      <Skeleton className="mt-4 h-6 w-32" /> {/* Title */}
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <Text
                        font={"bold"}
                        color={daily?.data > 0 ? "success" : "error"}
                        size={"xl"}
                      >
                        {daily?.data}%
                      </Text>
                      {daily?.data > 0 && (
                        <div className="mt-1">
                          <Image
                            src={"/images/winner.png"}
                            alt="student Photo"
                            width={20}
                            height={20}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Text color={"primary"} font={"semiBold"}>
                    {selectedStudent === null ? (
                      "Select Student"
                    ) : (
                      <Link href={`/follow-up/${selectedStudent}`}>
                        Show details
                      </Link>
                    )}
                  </Text>
                  <RiArrowRightSLine className="text-primary" size={25} />
                </div>
              </div>
            </Box>
            <Box>
              <Text font={"bold"} size={"xl"}>
                Upcoming Events
              </Text>
              {isLoading ? (
                <div className="flex items-center justify-between py-2">
                  <Skeleton className="mt-4 h-12 w-full" /> {/* Title */}
                </div>
              ) : (
                <>
                  {!data?.data?.content?.length ? (
                    <div className="mt-4 flex justify-between border-l-4 border-info p-4">
                      {selectedStudent === null
                        ? "Select Student"
                        : "There are no Upcoming Events"}
                    </div>
                  ) : (
                    data?.data?.content.map((event: any) => (
                      <div
                        key={event.id}
                        className="mt-4 flex justify-between border-l-4 border-info p-4"
                      >
                        <div>
                          <Text>Art Day</Text>
                          <Text color={"gray"}>Tomorrow</Text>
                        </div>
                        <div className="flex flex-col items-end">
                          <Text>2:00 PM</Text>
                          <Text>21 may,2024</Text>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </Box>
            <Box>
              <Text font={"bold"} size={"xl"}>
                Academic Progress
              </Text>
              <Text font={"bold"} color={"gray"}>
                This Semester
              </Text>
              <BoxGrid className="mt-4">
                {isGpa ? (
                  <div className="flex items-center justify-between py-2">
                    <Skeleton className="mt-4 h-6 w-32" /> {/* Title */}
                  </div>
                ) : (
                  <Box shadow="md">
                    <Text color={"gray"}>GPA</Text>
                    <Text font={"semiBold"}>{Gpa?.currentGpa}</Text>
                    <Text
                      color={
                        Gpa?.percentageDifference > 0 ? "success" : "error"
                      }
                    >
                      {Gpa?.percentageDifference}
                    </Text>
                  </Box>
                )}
                {isAttend ? (
                  <div className="flex items-center justify-between py-2">
                    <Skeleton className="mt-4 h-6 w-32" /> {/* Title */}
                  </div>
                ) : (
                  <Box shadow="md">
                    <Text color={"gray"}>Attendance</Text>
                    <Text font={"semiBold"}>{attend?.currentAttendance}%</Text>
                    <Text
                      color={
                        attend?.percentageDifference > 0 ? "success" : "error"
                      }
                    >
                      {attend?.percentageDifference}%
                    </Text>
                  </Box>
                )}
              </BoxGrid>
            </Box>
          </BoxGrid>

          <div className="mt-6">
            <Box>
              <Text font={"bold"} size={"xl"}>
                Grade Book
              </Text>
              <div className="flex w-full flex-col items-center justify-center gap-8 rounded-xl bg-bgPrimary p-8 md:flex-row md:items-start md:justify-start">
                <div className="w-full md:w-1/2 lg:w-1/4">
                  <RadioGroup.Root
                    className="gap-4 rounded-lg"
                    value={selectedGrade}
                    onValueChange={handleGradeChange}
                    aria-label="Grade Selection"
                  >
                    {subjects.map(({ value, label }) => (
                      <RadioGroup.Item
                        key={value}
                        value={value}
                        className="group mt-1 flex h-20 w-full flex-col justify-center rounded-l-2xl rounded-r-2xl bg-lightGray px-4 text-center text-textPrimary transition hover:border-primary hover:text-primary focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-75 data-[state=checked]:border-primary data-[state=checked]:bg-primary md:rounded-r-none"
                        aria-labelledby={`${value}-label`}
                      >
                        <span
                          id={`${value}-label`}
                          className="text-xl font-semibold group-data-[state=checked]:text-white"
                        >
                          {label}
                        </span>
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup.Root>
                </div>

                <div className="w-full md:w-1/2 lg:w-3/4 xl:mx-20">
                  {/* Display the selected subject's assignments */}
                  {selectedSubject && (
                    <>
                      <table className="w-full border-separate border-spacing-y-2 rounded-2xl">
                        <thead>
                          <tr className="text-textSecondary">
                            <th className="px-4 py-2 text-left">Assignment</th>
                            <th className="px-4 py-2 text-center">Score</th>
                            <th className="px-4 py-2 text-right">Weight</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-4">
                          {selectedSubject.assignments.map(
                            (assignment, index) => (
                              <tr
                                key={index}
                                className={`overflow-hidden rounded-2xl shadow-sm`}
                              >
                                <td
                                  className={`${index % 2 === 0 ? "bg-bgSecondary" : "bg-bgSecondary/50"} rounded-l-2xl px-4 py-2`}
                                >
                                  {assignment.name}
                                </td>
                                <td
                                  className={`${index % 2 === 0 ? "bg-bgSecondary" : "bg-bgSecondary/50"} px-4 py-2 text-center`}
                                >
                                  {assignment.score}
                                </td>
                                <td
                                  className={`${index % 2 === 0 ? "bg-bgSecondary" : "bg-bgSecondary/50"} rounded-r-2xl px-4 py-2 text-right`}
                                >
                                  {assignment.weight} &#160; &#160; &#160;
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                      <div className="mt-4 flex gap-1">
                        <Text font={"semiBold"}>Weighted Average Score: </Text>
                        <Text color={"gray"}>{selectedSubject.score}</Text>
                      </div>
                      <table className="mt-4 w-full border-separate border-spacing-y-2 rounded-2xl">
                        <thead>
                          <tr className="text-textSecondary">
                            <th className="px-4 py-2 text-left">
                              Historical Performance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="space-y-4">
                          {selectedSubject.historicalAssignments.map(
                            (history, index) => (
                              <tr
                                key={index}
                                className={`overflow-hidden rounded-2xl shadow-sm`}
                              >
                                <td
                                  className={`${index % 2 === 0 ? "bg-bgSecondary" : "bg-bgSecondary/50"} rounded-l-2xl px-4 py-2`}
                                >
                                  {history.name}
                                </td>
                                <td
                                  className={`${index % 2 === 0 ? "bg-bgSecondary" : "bg-bgSecondary/50"} rounded-r-2xl px-4 py-2 text-right`}
                                >
                                  {history.score} &#160; &#160; &#160;{" "}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                      <div className="mt-4">
                        <Text font={"semiBold"}>Teacher Comments</Text>
                        <Box
                          shadow="md"
                          border="borderSecondary"
                          className="mt-4"
                        >
                          {selectedSubject.teacherComments.map(
                            (comment, index) => (
                              <div key={index} className="space-y-4">
                                <div>
                                  <div className="flex gap-4">
                                    <div>
                                      <Image
                                        src={
                                          comment?.imgUrl || "/images/userr.png"
                                        }
                                        alt="Teacher Photo"
                                        width={35}
                                        height={35}
                                        className="rounded-full"
                                      />
                                    </div>
                                    <Text font={"semiBold"} size={"lg"}>
                                      {comment?.name}
                                    </Text>
                                  </div>
                                  <Text className="mt-4" size={"lg"}>
                                    {comment?.comment}
                                  </Text>
                                </div>
                              </div>
                            ),
                          )}
                        </Box>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Box>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <Text font="semiBold" size="xl">
            Select Student
          </Text>
        </div>
      )}
    </Container>
  );
};

export default FollowUp;
