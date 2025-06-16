"use client";
import Container from "~/_components/Container";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import Input from "~/_components/Input";
import { Text } from "~/_components/Text";
import {
  useCreateComplaint,
  useGetAllComplains,
} from "~/APIs/hooks/useComplains";
import { type ComplaintResponse, type Student } from "~/types";
import { useGetStudentsSimpleData, useGetStudentTeachers } from "~/APIs/hooks/useStudent";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "~/_components/Button";
import useLanguageStore from "~/APIs/store";

const Complaint = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<
    number | string | undefined
  >();
  const [selectedTeacherId, setSelectedTeacherId] = useState<
    number | string | undefined
  >(); // Added state for teacher selection
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const language = useLanguageStore((state) => state.language);
  const translate = (en: string, fr: string, ar: string) => {
    return language === "fr" ? fr : language === "ar" ? ar : en;
  };
  const { mutate: createComplaintMutation } = useCreateComplaint({
    onSuccess: () => {
      toast.success("Complaint submitted successfully!");
      refetchComplains();
    },
    onError: (error) => {
      toast.error("Complaint failed");
    },
  });

  const {
    data: dataStudents,
    error,
    isLoading: isStudentsLoading,
  } = useGetStudentsSimpleData();

  const {
    data: dataStudentTeacher,
    error: errorTeacher,
    isLoading: isStudentTeacherLoading,
  } = useGetStudentTeachers(selectedStudentId?.toString() ?? "");
  console.log(dataStudentTeacher);

  const handleSubmit = () => {
    if (!selectedStudentId || !selectedTeacherId || !subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    const complaintData : ComplaintResponse= {
      studentId: Number(selectedStudentId),
      teacherId: Number(selectedTeacherId), // Added teacherId to complaintData
      subject: subject,
      message: message,
    };

    createComplaintMutation(complaintData); // Sending the complaint data
  };

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(event.target.value);
  };

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Added handle for teacher change
    setSelectedTeacherId(event.target.value);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const { data, isLoading, refetch: refetchComplains } = useGetAllComplains();

  function formatBeautifulDate(dateString: string): string {
    const date = new Date(dateString);

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const ordinalDay = getOrdinalDay(day);

    return `${dayName}, ${month} ${ordinalDay}, ${year}`;
  }

  function getOrdinalDay(day: number): string {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  return (
    <>
<Container>
  <div className="m-4 mb-4 flex flex-col-reverse items-start justify-between gap-4 md:flex-row">
    <div className="flex w-full flex-col gap-4 rounded-xl bg-bgPrimary p-4">
      <Text font={"bold"} size={"4xl"}>
        {translate("Complaints", "Plaintes", "الشكاوى")}
      </Text>
      <div className="pb-4">
        {data?.data.content.map((compliant) => (
          <div
            key={compliant.id}
            className="mt-4 flex items-center justify-between rounded-xl border border-borderPrimary p-4"
          >
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                {compliant.approved ? (
                  <BsArrowUpRight size={30} className="text-success" />
                ) : (
                  <BsArrowDownLeft size={20} className="text-error" />
                )}
              </div>
              <div>
                <Text size={"lg"} font="medium">
                  {compliant.teacherName}
                </Text>
                <Text size={"lg"} font="medium">
                  {compliant.studentName}
                </Text>
                <Text size={"md"}>{compliant.message}</Text>
                <Text color={"gray"}>
                  {formatBeautifulDate(compliant.creationDateTime)}
                </Text>
              </div>
            </div>
            <div className="mt-[2px]">
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full rounded-xl bg-bgPrimary p-4 md:w-1/2">
      <Text font={"bold"} size={"2xl"}>
        {translate("Add Complaint", "Ajouter une plainte", "إضافة شكوى")}
      </Text>
      <div className="w-full">
        <label htmlFor="student">
          <select
            name="student"
            id="student"
            className="mt-4 w-full rounded-lg border border-borderPrimary bg-bgPrimary p-3 text-textPrimary outline-none transition duration-200 ease-in"
            onChange={handleStudentChange}
          >
            <option value="">
              {translate("Select student", "Sélectionnez un étudiant", "اختر الطالب")}
            </option>
            {dataStudents?.data?.map((student: any) => (
              <option key={student.studentId} value={student.studentId}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="teacher">
          <select
            name="teacher"
            id="teacher"
            className="mt-4 w-full rounded-lg border border-borderPrimary bg-bgPrimary p-3 text-textPrimary outline-none transition duration-200 ease-in"
            onChange={handleTeacherChange} // Handle teacher selection
          >
            <option value="">
              {translate("Select teacher", "Sélectionnez un enseignant", "اختر المعلم")}
            </option>
            {dataStudentTeacher?.data?.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="subject">
          <Input
            placeholder={translate("Subject", "Sujet", "الموضوع")}
            theme="transparent"
            className="mt-4"
            border="gray"
            value={subject}
            onChange={handleSubjectChange}
          />
        </label>

        <label htmlFor="area">
          <Input
            id="message"
            placeholder={translate(
              "Write the problem",
              "Décrivez le problème",
              "اكتب المشكلة",
            )}
            theme="transparent"
            className="mt-4 py-10"
            border="gray"
            value={message}
            onChange={handleMessageChange}
          />
        </label>

        <Button onClick={handleSubmit} className="mt-4">
          {translate("Submit", "Envoyer", "إرسال")}
        </Button>
      </div>
    </div>
  </div>
</Container>


    </>
  );
};

export default Complaint;
