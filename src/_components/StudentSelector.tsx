"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { useGetAllStudents } from "~/APIs/hooks/useGrades";
import { useStudentStore } from "~/APIs/store";

export default function StudentSelector() {
  const { selectedStudentId, setSelectedStudentId } = useStudentStore();
  const { data } = useGetAllStudents();

  const students = data?.data ?? [];

  return (
    <>
      <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
        <SelectTrigger>
          <SelectValue placeholder="Select Student" />
        </SelectTrigger>
        <SelectContent>
          {students.map((student: any) => (
            <SelectItem
              key={student.studentId}
              value={student.studentId.toString()}
            >
              <div className="flex items-center gap-2">
                <img
                  src={student.profilePicture}
                  alt={student.name}
                  className="h-6 w-6 rounded-full"
                />
                <span>
                  {student.name} ({student.grade})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
