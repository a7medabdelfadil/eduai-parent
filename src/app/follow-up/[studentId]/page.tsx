"use client";
import Box from "~/_components/Box";
import Container from "~/_components/Container";
import { Text } from "~/_components/Text";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useEffect, useState } from "react";
import {
  useGetAttemptAnswers,
  useGetDailyExamAttempts,
  useGetDailyExamData,
} from "~/APIs/hooks/useExam";
import { useParams } from "next/navigation";
import Spinner from "~/_components/Spinner";

const DailyPlan = () => {
  const { studentId } = useParams();
  const [examId, setExamId] = useState<string>("");
  const [attemptId, setAttemptId] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  // Fetch API data
  const { data: dataDailyExam, isLoading: isExamLoading } = useGetDailyExamData(
    studentId?.toString() ?? "",
  );
  const { data: dataDailyExamAttempts, isLoading: isDailyExamAttempts } =
    useGetDailyExamAttempts(studentId?.toString() ?? "", examId);
  const { data: dataAttemptAnswers, isLoading: isAttemptAnswers } =
    useGetAttemptAnswers(studentId?.toString() ?? "", attemptId);

  // Update states on data change
  useEffect(() => {
    if (dataDailyExam?.data?.[0]) {
      setExamId(dataDailyExam.data[0].id.toString());
      setSelectedGrade(dataDailyExam.data[0].courseName);
    }
    if (dataDailyExamAttempts?.data?.[0]) {
      setAttemptId(dataDailyExamAttempts.data[0].id.toString());
    }
  }, [dataDailyExam?.data, dataDailyExamAttempts?.data]);

  const handleGradeChange = (gradeValue: string) => {
    setSelectedGrade(gradeValue);
  };

  if (isExamLoading || isDailyExamAttempts || isAttemptAnswers) {
    return (
      <Container>
        <div className="flex h-[75vh] items-center justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Box>
        <Text font={"bold"} size={"2xl"}>
          Daily Plan
        </Text>
        <div className="flex w-full flex-col items-center justify-center gap-8 rounded-xl bg-bgPrimary p-8 md:items-start md:justify-start lg:flex-row">
          {/* Radio Group for Grade Selection */}
          <div className="w-full md:w-1/4">
            <RadioGroup.Root
              className="gap-4"
              value={selectedGrade}
              onValueChange={handleGradeChange}
              aria-label="Grade Selection"
            >
              {dataDailyExam?.data?.map(
                ({
                  courseName,
                  gradeLetter,
                  correctPoints,
                  totalPoints,
                  id,
                }) => (
                  <RadioGroup.Item
                    key={id}
                    value={courseName}
                    className="group mt-1 flex h-20 w-full flex-col justify-center rounded-l-2xl rounded-r-2xl bg-lightGray px-4 text-center text-textPrimary transition hover:border-primary hover:text-primary focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-75 data-[state=checked]:border-primary data-[state=checked]:bg-primary lg:rounded-r-none"
                    aria-labelledby={`${id}-label`}
                  >
                    <div className="flex w-full justify-between">
                      <span
                        id={`${courseName}-label`}
                        className="text-xl font-semibold group-data-[state=checked]:text-white"
                      >
                        {courseName}
                      </span>
                      <div className="">
                        <p className="font-bold text-textPrimary group-data-[state=checked]:text-white">
                          {gradeLetter}
                        </p>
                        <p className="font-bold text-success group-data-[state=checked]:text-white">
                          {correctPoints} of {totalPoints}
                        </p>
                      </div>
                    </div>
                  </RadioGroup.Item>
                ),
              )}
            </RadioGroup.Root>
          </div>

          {/* Questions Display */}
          <div className="w-full md:w-3/4">
            {dataAttemptAnswers?.data && dataAttemptAnswers.data.length > 0 ? (
              dataAttemptAnswers.data.map((question, index) => (
                <div key={index} className="mb-6 ml-10">
                  <Text font={"semiBold"} size={"xl"} className="mb-4">
                    Question {index + 1}
                  </Text>
                  <Text size={"lg"} className="mb-2">
                    {question.question}
                  </Text>
                  <ul className="list-none pl-4">
                    {question.options?.map((option, idx) => {
                      const optionClass =
                        option === question.correctAnswer
                          ? "text-success"
                          : option === question.studentAnswer
                            ? question.isAnsweredCorrectly
                              ? "text-success"
                              : "text-error"
                            : "text-textPrimary";

                      return (
                        <li key={idx} className={`-ml-3 ${optionClass}`}>
                          {idx == 0
                            ? "A"
                            : idx == 1
                              ? "B"
                              : idx == 2
                                ? "C"
                                : idx == 3
                                  ? "D"
                                  : ""}
                          ) {option}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <Text>No questions available for this attempt.</Text>
            )}
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default DailyPlan;
