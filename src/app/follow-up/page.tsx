"use client";
import Container from "~/_components/Container";
import * as React from "react";
import Box from "~/_components/Box";
import Button from "~/_components/Button";
import SearchableSelect from "~/_components/SearchSelect";
import { Controller, useForm } from "react-hook-form";
import { Text } from "~/_components/Text";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import Image from "next/image";
import BoxGrid from "~/_components/BoxGrid";
import { RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";

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
      <div className="mb-8 flex gap-4 justify-between">
        <div>
          <Controller
            name="schoolId"
            control={control}
            rules={{ required: "School selection is required" }}
            defaultValue="" // Initialize with a default value
            render={({ field: { onChange, value } }) => (
              <SearchableSelect
                value={value}
                onChange={onChange}
                placeholder="Select School"
                options={names}
                border="border-borderPrimary"
              />
            )}
          />
        </div>

        <div>
          <Button>+ Add Another Child</Button>
        </div>
      </div>

      <BoxGrid>
        <Box>
          <div className="flex justify-between">
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
                  Khadija Yassine Hamdallah
                </Text>
                <Text color={"gray"} font={"semiBold"} className="mt-4">
                  @khadija_yassine
                </Text>
              </div>
            </div>
            <div>
              <Text font={"bold"} color={"gray"}>
                Grade 5
              </Text>
            </div>
          </div>
        </Box>
        <Box>
          <div className="flex items-center justify-between">
            <div>
              <Text font={"bold"} size={"xl"}>
                Daily plan
              </Text>
              <div className="mt-4 flex gap-2">
                <Text font={"bold"} color={"success"} size={"xl"}>
                  95%
                </Text>
                <div className="mt-1">
                  <Image
                    src={"/images/winner.png"}
                    alt="student Photo"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Text color={"primary"} font={"semiBold"}>
                <Link href={"/dailyplan"}>Show details</Link>
              </Text>
              <RiArrowRightSLine className="text-primary" size={25} />
            </div>
          </div>
        </Box>
        <Box>
          <Text font={"bold"} size={"xl"}>
            Upcoming Events
          </Text>
          <div className="mt-4 flex justify-between border-l-4 border-warning p-4">
            <div>
              <Text>Art Day</Text>
              <Text color={"gray"}>Tomorrow</Text>
            </div>
            <div className="flex flex-col items-end">
              <Text>2:00 PM</Text>
              <Text>21 may,2024</Text>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-l-4 border-info p-4">
            <div>
              <Text>Art Day</Text>
              <Text color={"gray"}>Tomorrow</Text>
            </div>
            <div className="flex flex-col items-end">
              <Text>2:00 PM</Text>
              <Text>21 may,2024</Text>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-l-4 border-warning p-4">
            <div>
              <Text>Art Day</Text>
              <Text color={"gray"}>Tomorrow</Text>
            </div>
            <div className="flex flex-col items-end">
              <Text>2:00 PM</Text>
              <Text>21 may,2024</Text>
            </div>
          </div>
        </Box>
        <Box>
          <Text font={"bold"} size={"xl"}>
            Academic Progress
          </Text>
          <Text font={"bold"} color={"gray"}>
            This Semester
          </Text>
          <BoxGrid className="mt-4">
            <Box shadow="md">
              <Text color={"gray"}>GPA</Text>
              <Text font={"semiBold"}>5.8</Text>
              <Text color={"success"}>+1.3</Text>
            </Box>
            <Box shadow="md">
              <Text color={"gray"}>Attendance</Text>
              <Text font={"semiBold"}>84%</Text>
              <Text color={"error"}>-3%</Text>
            </Box>
            <Box shadow="md">
              <Text color={"gray"}>Class Participation</Text>
              <Text font={"semiBold"}>Good</Text>
              <Text color={"success"}>+3</Text>
            </Box>
            <Box shadow="md">
              <Text color={"gray"}>Student Behavior</Text>
              <Text font={"semiBold"}>Good</Text>
              <Text color={"success"}>+4</Text>
            </Box>
          </BoxGrid>
        </Box>
      </BoxGrid>

      <div className="mt-6">
        <Box>
          <Text font={"bold"} size={"xl"}>
            Grade Book
          </Text>
          <div className="flex w-full flex-col lg:flex-row justify-center md:justify-start items-center md:items-start gap-8 rounded-xl bg-bgPrimary p-8">
            <div className="w-full lg:w-1/5">
              <RadioGroup.Root
                className="gap-4"
                value={selectedGrade}
                onValueChange={handleGradeChange}
                aria-label="Grade Selection"
              >
                {subjects.map(({ value, label }) => (
                  <RadioGroup.Item
                    key={value}
                    value={value}
                    className="group mt-1 flex h-20 w-full flex-col justify-center rounded-l-2xl rounded-r-2xl lg:rounded-r-none bg-lightGray px-4 text-center text-textPrimary transition hover:border-primary hover:text-primary focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-75 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
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

            <div className="w-full lg:w-1/5">
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
                      {selectedSubject.assignments.map((assignment, index) => (
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
                      ))}
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
                    <Box border="borderSecondary" className="mt-4">
                      {selectedSubject.teacherComments.map((comment, index) => (
                        <div key={index} className="space-y-4">
                          <div>
                            <div className="flex gap-4">
                              <div>
                                <Image
                                  src={comment?.imgUrl || "/images/userr.png"}
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
                      ))}
                    </Box>
                  </div>
                </>
              )}
            </div>
          </div>
        </Box>
      </div>
    </Container>
  );
};

export default FollowUp;
