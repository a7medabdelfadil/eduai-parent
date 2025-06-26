"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import Container from "~/_components/Container";
import { Text } from "~/_components/Text";
import Input from "~/_components/Input";
import Button from "~/_components/Button";

import {
  useCreateParentStudent,
  useGetAssociationTypes,
  useGetStudyLevels,
} from "~/APIs/hooks/useStudent";

import type { CreateParentStudentRequest, ParentStudentPayload } from "~/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useLanguageStore from "~/APIs/store";

/** -----------------------------------------------------
 * Simple i18n helper
 * -----------------------------------------------------*/
const translations = {
  en: {
    newStudent: "New Student",
    registerMsg: "Register a student linked to your parent account",
    username: "Username",
    email: "Email",
    password: "Password",
    nationalId: "National ID",
    nameEn: "Name (English)",
    nameAr: "Name (Arabic)",
    nameFr: "Name (French)",
    birthDate: "Birth Date",
    eduSystemId: "Edu System ID",
    gender: "Gender",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    relationship: "Relationship to Student",
    studyLevel: "Study Level",
    prefLang: "Preferred Language",
    department: "Department",
    subDepartment: "Sub-Department",
    scientific: "Scientific",
    literature: "Literature",
    mathSci: "Mathematical Sciences",
    bioSci: "Biological Sciences",
    about: "About the student",
    idPhoto: "Student ID Photo",
    profilePhoto: "Profile Photo",
    certificates: "Certificates of Achievement (multiple)",
    hasScholarship: "Has Scholarship",
    select: "Select...",
    create: "Create Student",
    submitting: "Submitting…",
    success: "Student created successfully!",
  },
  ar: {
    newStudent: "طالب جديد",
    registerMsg: "سجل طالب مرتبط بحساب الوالد",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    nationalId: "الرقم القومي",
    nameEn: "الاسم (إنجليزي)",
    nameAr: "الاسم (عربي)",
    nameFr: "الاسم (فرنسي)",
    birthDate: "تاريخ الميلاد",
    eduSystemId: "كود النظام التعليمي",
    gender: "النوع",
    selectGender: "اختر النوع",
    male: "ذكر",
    female: "أنثى",
    relationship: "صلة القرابة بالطالب",
    studyLevel: "المستوى الدراسي",
    prefLang: "اللغة المفضلة",
    department: "الشعبة",
    subDepartment: "التخصص الفرعي",
    scientific: "علمي",
    literature: "أدبي",
    mathSci: "علوم رياضية",
    bioSci: "علوم بيولوجية",
    about: "عن الطالب",
    idPhoto: "صورة بطاقة الطالب",
    profilePhoto: "صورة الملف الشخصي",
    certificates: "شهادات التفوق (متعددة)",
    hasScholarship: "يملك منحة دراسية",
    select: "اختر...",
    create: "إنشاء طالب",
    submitting: "جارٍ الإرسال…",
    success: "تم إنشاء الطالب بنجاح!",
  },
  fr: {
    newStudent: "Nouvel Élève",
    registerMsg: "Enregistrer un élève lié à votre compte parent",
    username: "Nom d'utilisateur",
    email: "E‑mail",
    password: "Mot de passe",
    nationalId: "ID National",
    nameEn: "Nom (Anglais)",
    nameAr: "Nom (Arabe)",
    nameFr: "Nom (Français)",
    birthDate: "Date de naissance",
    eduSystemId: "ID Système éducatif",
    gender: "Genre",
    selectGender: "Sélectionner le genre",
    male: "Homme",
    female: "Femme",
    relationship: "Relation avec l'élève",
    studyLevel: "Niveau d'étude",
    prefLang: "Langue préférée",
    department: "Département",
    subDepartment: "Sous‑département",
    scientific: "Scientifique",
    literature: "Littéraire",
    mathSci: "Sciences Mathématiques",
    bioSci: "Sciences Biologiques",
    about: "À propos de l'élève",
    idPhoto: "Photo d'identité de l'élève",
    profilePhoto: "Photo de profil",
    certificates: "Certificats d'excellence (multiples)",
    hasScholarship: "Bourse d'étude",
    select: "Sélectionner...",
    create: "Créer l'élève",
    submitting: "Envoi en cours…",
    success: "Élève créé avec succès !",
  },
} as const;

export default function NewParentStudentPage() {
  const router = useRouter();
  const lang = useLanguageStore((s) => s.language) as keyof typeof translations;
  const t = translations[lang] ?? translations.en;

  /* previews */
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  /* form */
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({ shouldUnregister: true });

  const {
    data: associationTypes = {},
    isLoading: isAssocLoading,
    isError: isAssocError,
  } = useGetAssociationTypes();
  const {
    data: studyLevels = {},
    isLoading: isStudyLoading,
    isError: isStudyError,
  } = useGetStudyLevels();

  const { mutate, isPending: isSubmitting } = useCreateParentStudent();

  /* watch */
  const idFile = watch("studentIdPhoto");
  const profileFile = watch("studentProfilePhoto");
  const selectedDepartment = watch("department");

  /* previews */
  useEffect(() => {
    if (idFile?.length) {
      const url = URL.createObjectURL(idFile[0]);
      setIdPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [idFile]);

  useEffect(() => {
    if (profileFile?.length) {
      const url = URL.createObjectURL(profileFile[0]);
      setProfilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileFile]);

  const onSubmit = (data: any) => {
    const request: ParentStudentPayload = {
      username: data.username,
      email: data.email,
      password: data.password,
      nid: data.nid,
      gender: data.gender,
      birthDate: data.birthDate,
      name_en: data.name_en,
      name_ar: data.name_ar,
      name_fr: data.name_fr,
      about: data.about,
      relationshipToStudent: data.relationshipToStudent,
      studyLevel: data.studyLevel,
      eduSystemId: Number(data.eduSystemId),
      hasScholarship: data.hasScholarship ? 1 : 0,
      language: data.language,
      department: data.department,
      subDepartment: data.subDepartment,
    };

    const payload: CreateParentStudentRequest = {
      studentIdPhoto: data.studentIdPhoto[0],
      studentProfilePhoto: data.studentProfilePhoto[0],
      studentCertificatesOfAchievement: data.studentCertificatesOfAchievement,
      request,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(t.success);
        router.push("/follow-up");
      },
      onError: (err: any) => {
        const apiErr = err.response?.data;
        const details =
          Array.isArray(apiErr?.data) && apiErr.data.length
            ? apiErr.data.join(", ")
            : (apiErr?.message ?? "Something went wrong");
        toast.error(details);
      },
    });
  };

  return (
    <Container>
      <div
        dir={lang == "ar" ? "rtl" : "ltr"}
        className="rounded-xl bg-bgPrimary p-4"
      >
        <header className="mb-10 text-center">
          <Text font="bold" size="4xl" className="mb-2">
            {t.newStudent}
          </Text>
          <Text font="medium" size="lg" color="gray">
            {t.registerMsg}
          </Text>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid w-full gap-6 px-4 sm:px-10 lg:px-24 xl:px-32 2xl:px-40"
        >
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={t.username}
              placeholder={t.username}
              theme="transparent"
              error={errors.username?.message?.toString() ?? ""}
              {...register("username", {
                required: t.username + " required",
                minLength: { value: 3, message: "Min length 3" },
              })}
            />
            <Input
              label={t.email}
              placeholder={t.email}
              theme="transparent"
              error={errors.email?.message?.toString() ?? ""}
              {...register("email", {
                required: t.email + " required",
                pattern: {
                  value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
                  message: "Invalid email",
                },
              })}
            />
            <Input
              type="password"
              label={t.password}
              placeholder={t.password}
              theme="transparent"
              error={errors.password?.message?.toString() ?? ""}
              {...register("password", {
                required: t.password + " required",
                minLength: { value: 6, message: "Min length 6" },
              })}
            />
            <Input
              label={t.nationalId}
              placeholder={t.nationalId}
              theme="transparent"
              error={errors.nid?.message?.toString() ?? ""}
              {...register("nid", { required: t.nationalId + " required" })}
            />
            <Input
              label={t.nameEn}
              placeholder={t.nameEn}
              theme="transparent"
              error={errors.name_en?.message?.toString() ?? ""}
              {...register("name_en", { required: t.nameEn + " required" })}
            />
            <Input
              label={t.nameAr}
              placeholder={t.nameAr}
              theme="transparent"
              error={errors.name_ar?.message?.toString() ?? ""}
              {...register("name_ar", { required: t.nameAr + " required" })}
            />
            <Input
              label={t.nameFr}
              placeholder={t.nameFr}
              theme="transparent"
              error={errors.name_fr?.message?.toString() ?? ""}
              {...register("name_fr", { required: t.nameFr + " required" })}
            />
            <Input
              type="date"
              label={t.birthDate}
              placeholder={t.birthDate}
              theme="transparent"
              error={errors.birthDate?.message?.toString() ?? ""}
              {...register("birthDate", {
                required: t.birthDate + " required",
              })}
            />
            <Input
              type="number"
              label={t.eduSystemId}
              placeholder={t.eduSystemId}
              theme="transparent"
              error={errors.eduSystemId?.message?.toString() ?? ""}
              {...register("eduSystemId", {
                required: t.eduSystemId + " required",
              })}
            />
          </div>

          {/* Selects */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Gender */}
            <Controller
              name="gender"
              control={control}
              rules={{ required: t.gender + " required" }}
              render={({ field }) => (
                <div className="flex flex-col text-left">
                  <Text font="medium" size="sm" className="mb-1">
                    {t.gender}
                  </Text>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.gender ? "border-error" : ""}`}
                    >
                      <SelectValue placeholder={t.selectGender} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t.male}</SelectItem>
                      <SelectItem value="FEMALE">{t.female}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-error">
                      {errors.gender.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Relationship */}
            <Controller
              name="relationshipToStudent"
              control={control}
              rules={{ required: t.relationship + " required" }}
              render={({ field }) => (
                <div className="flex flex-col text-left">
                  <Text font="medium" size="sm" className="mb-1">
                    {t.relationship}
                  </Text>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isAssocLoading || isAssocError}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.relationshipToStudent ? "border-error" : ""} disabled:opacity-50`}
                    >
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(associationTypes).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {errors.relationshipToStudent && (
                    <p className="mt-1 text-sm text-error">
                      {errors.relationshipToStudent.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Study Level */}
            <Controller
              name="studyLevel"
              control={control}
              rules={{ required: t.studyLevel + " required" }}
              render={({ field }) => (
                <div className="flex flex-col text-left">
                  <Text font="medium" size="sm" className="mb-1">
                    {t.studyLevel}
                  </Text>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isStudyLoading || isStudyError}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.studyLevel ? "border-error" : ""} disabled:opacity-50`}
                    >
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(studyLevels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.studyLevel && (
                    <p className="mt-1 text-sm text-error">
                      {errors.studyLevel.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Preferred Language */}
            <Controller
              name="language"
              control={control}
              rules={{ required: t.prefLang + " required" }}
              render={({ field }) => (
                <div className="flex flex-col text-left">
                  <Text font="medium" size="sm" className="mb-1">
                    {t.prefLang}
                  </Text>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.language ? "border-error" : ""}`}
                    >
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARABIC">Arabic</SelectItem>
                      <SelectItem value="ENGLISH">English</SelectItem>
                      <SelectItem value="FRENCH">French</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className="mt-1 text-sm text-error">
                      {errors.language.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Department */}
            <Controller
              name="department"
              control={control}
              rules={{ required: t.department + " required" }}
              render={({ field }) => (
                <div className="flex flex-col text-left">
                  <Text font="medium" size="sm" className="mb-1">
                    {t.department}
                  </Text>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.department ? "border-error" : ""}`}
                    >
                      {" "}
                      <SelectValue placeholder={t.select} />{" "}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCIENTIFIC">{t.scientific}</SelectItem>
                      <SelectItem value="LITERATURE">{t.literature}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-error">
                      {errors.department.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Sub‑Department */}
            {selectedDepartment === "SCIENTIFIC" && (
              <Controller
                name="subDepartment"
                control={control}
                rules={{
                  required:
                    selectedDepartment === "SCIENTIFIC"
                      ? t.subDepartment + " required"
                      : false,
                }}
                render={({ field }) => (
                  <div className="flex flex-col text-left">
                    <Text font="medium" size="sm" className="mb-1">
                      {t.subDepartment}
                    </Text>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`w-full ${errors.subDepartment ? "border-error" : ""}`}
                      >
                        {" "}
                        <SelectValue placeholder={t.select} />{" "}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MATHEMATICAL_SCIENCES">
                          {t.mathSci}
                        </SelectItem>
                        <SelectItem value="BIOLOGICAL_SCIENCES">
                          {t.bioSci}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subDepartment && (
                      <p className="mt-1 text-sm text-error">
                        {errors.subDepartment.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            )}
          </div>

          {/* About */}
          <textarea
            {...register("about", { required: t.about + " required" })}
            placeholder={t.about}
            className="h-32 w-full rounded-md border bg-transparent p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.about && (
            <p className="mt-1 text-sm text-error">
              {errors.about.message?.toString()}
            </p>
          )}

          {/* Files */}
          <div dir="ltr" className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-left">
              <Text font="medium" size="sm" className="mb-1">
                {t.idPhoto}
              </Text>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
                {...register("studentIdPhoto", {
                  required: t.idPhoto + " required",
                })}
              />
              {idPreview && (
                <img
                  src={idPreview}
                  alt="ID Preview"
                  className="mt-2 h-24 rounded object-cover"
                />
              )}
              {errors.studentIdPhoto && (
                <p className="mt-1 text-sm text-error">
                  {errors.studentIdPhoto.message?.toString()}
                </p>
              )}
            </label>

            <label className="flex flex-col text-left">
              <Text font="medium" size="sm" className="mb-1">
                {t.profilePhoto}
              </Text>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
                {...register("studentProfilePhoto", {
                  required: t.profilePhoto + " required",
                })}
              />
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="mt-2 h-24 rounded object-cover"
                />
              )}
              {errors.studentProfilePhoto && (
                <p className="mt-1 text-sm text-error">
                  {errors.studentProfilePhoto.message?.toString()}
                </p>
              )}
            </label>
          </div>

          <label dir="ltr" className="flex flex-col text-left">
            <Text font="medium" size="sm" className="mb-1">
              {t.certificates}
            </Text>
            <input
              type="file"
              accept="application/pdf,image/*"
              multiple
              className="file-input file-input-bordered file-input-primary w-full"
              {...register("studentCertificatesOfAchievement", {
                required: t.certificates + " required",
              })}
            />
            {errors.studentCertificatesOfAchievement && (
              <p className="mt-1 text-sm text-error">
                {errors.studentCertificatesOfAchievement.message?.toString()}
              </p>
            )}
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("hasScholarship")} />
            <Text size="sm">{t.hasScholarship}</Text>
          </label>

          <div className="flex justify-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t.submitting : t.create}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
