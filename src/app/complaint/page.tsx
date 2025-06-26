"use client";
import Container from "~/_components/Container";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import Input from "~/_components/Input";
import { Text } from "~/_components/Text";
import {
  useCreateComplaint,
  useGetAllComplains,
} from "~/APIs/hooks/useComplains";
import {
  useGetStudentsSimpleData,
  useGetStudentTeachers,
} from "~/APIs/hooks/useStudent";
import { type ComplaintResponse } from "~/types";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Button from "~/_components/Button";
import useLanguageStore from "~/APIs/store";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";

const Complaint = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | string>();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | string>();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllEarlier, setShowAllEarlier] = useState(false);

  const language = useLanguageStore((state) => state.language);
  const translate = (en: string, fr: string, ar: string) =>
    language === "fr" ? fr : language === "ar" ? ar : en;

  const { mutate: createComplaintMutation } = useCreateComplaint({
    onSuccess: () => {
      toast.success(
        translate(
          "Complaint submitted successfully!",
          "Réclamation soumise avec succès!",
          "تم تقديم الشكوى بنجاح!"
        )
      );
      refetchComplains();
      setSelectedStudentId(undefined);
      setSelectedTeacherId(undefined);
      setSubject("");
      setMessage("");
      setAudioBlob(null);
      setAudioURL(null);
      setMediaRecorder(null);
    },
    onError: () =>
      toast.error(
        translate("Complaint failed", "Échec de la réclamation", "فشلت الشكوى")
      ),
  });

  const { data: dataStudents } = useGetStudentsSimpleData();
  const { data: dataStudentTeacher } = useGetStudentTeachers(
    selectedStudentId?.toString() ?? ""
  );
  const { data, refetch: refetchComplains } = useGetAllComplains();

  const ITEMS_PER_PAGE = 3;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const complaints = data?.data.content || [];
  const recent = complaints.filter(
    (c: any) => new Date(c.creationDateTime) >= sevenDaysAgo
  );
  const earlier = complaints.filter(
    (c: any) => new Date(c.creationDateTime) < sevenDaysAgo
  );

  const displayedRecent = showAllRecent ? recent : recent.slice(0, ITEMS_PER_PAGE);
  const displayedEarlier = showAllEarlier ? earlier : earlier.slice(0, ITEMS_PER_PAGE);

  const handleSubmit = () => {
    if (
      !selectedStudentId ||
      !selectedTeacherId ||
      !subject.trim() ||
      (!message.trim() && !audioBlob)
    ) {
      toast.error(
        translate(
          "Please fill in all fields.",
          "Veuillez remplir tous les champs.",
          "يرجى ملء جميع الحقول."
        )
      );
      return;
    }

    const complaintData: ComplaintResponse = {
      studentId: Number(selectedStudentId),
      teacherId: Number(selectedTeacherId),
      subject: subject.trim(),
      message: message.trim(),
    };

    const form = new FormData();
    form.append("complain", JSON.stringify(complaintData));
    if (audioBlob) form.append("file", audioBlob, "voice.webm");

    createComplaintMutation(form);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setRecordingSeconds(0);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };

  const ComplaintSection = ({
    title,
    complaints,
    showAll,
    onShowMore,
  }: {
    title: string;
    complaints: any[];
    showAll: boolean;
    onShowMore: () => void;
  }) => (
    <div className="mb-6">
      <Text font="bold" size="xl" className="mb-4">
        {title}
      </Text>
      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          className="mt-4 rounded-xl border border-borderPrimary bg-bgPrimary p-4"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/10">
              {complaint.approved ? (
                <BsArrowUpRight size={22} className="text-success" />
              ) : (
                <BsArrowDownLeft size={18} className="text-error" />
              )}
            </div>
            <div className="flex-1">
              <Text size="lg" font="bold" className="text-textPrimary">
                {complaint.teacherName}
              </Text>
              <Text size="lg" font="medium" className="text-textSecondary">
                {complaint.studentName}
              </Text>
              <Text size="md" className="mt-1 text-textPrimary">
                {complaint.message}
              </Text>
              {complaint.isVoiceNoteExists && complaint.viewVoiceNoteLink && (
                <div className="mt-3 overflow-hidden rounded-md">
                  <audio controls src={complaint.viewVoiceNoteLink} className="w-full" />
                </div>
              )}
              <Text size="sm" color="gray" className="mt-2 italic">
                {complaint.creationDateTime}
              </Text>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <button onClick={onShowMore} className="mt-6 flex items-center gap-2">
          {showAll ? (
            <>
              {translate("Show Less", "Montrer moins", "عرض أقل")}
              <IoIosArrowUp className="mt-1" />
            </>
          ) : (
            <>
              {translate("See More", "Voir plus", "عرض المزيد")}
              <IoIosArrowDown className="mt-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Container>
      <div className="m-4 mb-4 flex flex-col-reverse items-start justify-between gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 rounded-xl bg-bgPrimary p-4 md:w-3/5">
          <Text font="bold" size="4xl">
            {translate("Complaints", "Plaintes", "الشكاوى")}
          </Text>
          <div className="border-b border-borderPrimary pb-4">
            {displayedRecent && (
              <ComplaintSection
                title={translate(
                  "Recent Complaints",
                  "Réclamations récentes",
                  "الشكاوى الحديثة",
                )}
                complaints={displayedRecent}
                showAll={showAllRecent}
                onShowMore={() => setShowAllRecent(!showAllRecent)}
              />
            )}
            {displayedEarlier && (
              <ComplaintSection
                title={translate(
                  "Earlier Complaints",
                  "Réclamations antérieures",
                  "الشكاوى السابقة",
                )}
                complaints={displayedEarlier}
                showAll={showAllEarlier}
                onShowMore={() => setShowAllEarlier(!showAllEarlier)}
              />
            )}
          </div>
        </div>

        <div className="w-full rounded-xl bg-bgPrimary p-4 md:w-2/5">
          <Text font="bold" size="2xl">
            {translate("Add Complaint", "Ajouter une plainte", "إضافة شكوى")}
          </Text>
          <div className="w-full">
            <select
              name="student"
              id="student"
              className="mt-4 w-full rounded-lg border border-borderPrimary bg-bgPrimary p-3 text-textPrimary outline-none transition duration-200 ease-in"
              onChange={(e) => setSelectedStudentId(e.target.value)}
              value={selectedStudentId}
            >
              <option value="">
                {translate(
                  "Select student",
                  "Sélectionnez un étudiant",
                  "اختر الطالب",
                )}
              </option>
              {dataStudents?.data?.map((student: any) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.name}
                </option>
              ))}
            </select>

            <select
              name="teacher"
              id="teacher"
              className="mt-4 w-full rounded-lg border border-borderPrimary bg-bgPrimary p-3 text-textPrimary outline-none transition duration-200 ease-in"
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              value={selectedTeacherId}
            >
              <option value="">
                {translate(
                  "Select teacher",
                  "Sélectionnez un enseignant",
                  "اختر المعلم",
                )}
              </option>
              {dataStudentTeacher?.data?.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>

            <label htmlFor="subject">
              <Input
                placeholder={translate("Subject", "Sujet", "الموضوع")}
                theme="transparent"
                className="mt-4"
                border="gray"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <div className="mt-4 rounded-lg border border-dashed border-primary p-4 text-center">
              {!audioURL ? (
                <>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="rounded-full bg-primary px-6 py-2 text-white"
                  >
                    {isRecording ? (
                      translate(
                        "Stop Recording",
                        "Arrêter l'enregistrement",
                        "إيقاف التسجيل",
                      )
                    ) : (
                      <FaMicrophone size={22} />
                    )}
                  </button>
                  {isRecording && (
                    <p className="mt-2 text-sm text-gray-500">
                      {translate("Recording", "Enregistrement", "جارٍ التسجيل")}
                      : {recordingSeconds}s
                    </p>
                  )}
                </>
              ) : (
                <>
                  <audio controls src={audioURL} className="w-full" />
                  <p className="mt-2 text-sm text-gray-500">Voice attached</p>
                  <button
                    onClick={deleteRecording}
                    className="mt-2 text-sm text-red-600 underline"
                  >
                    {translate("Delete", "Supprimer", "حذف")}
                  </button>
                </>
              )}
            </div>

            <Button onClick={handleSubmit} className="mt-4">
              {translate("Submit", "Envoyer", "إرسال")}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Complaint;
