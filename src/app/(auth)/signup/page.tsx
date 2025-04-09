"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import React, { useState } from "react";
import Input from "~/_components/Input";
import Button from "~/_components/Button";
import { Text } from "~/_components/Text";
import Spinner from "~/_components/Spinner";
import type { SignUpFormData } from "~/types";
import { useForm, Controller } from "react-hook-form";
import SearchableSelect from "~/_components/SearchSelect";
import {
  useGetAllRegions,
  useGetAllSchools,
  useGetAllCountries,
  useGetAllNationalities,
  useSignUp,
} from "~/APIs/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const Signup = () => {
  const [step, setStep] = useState(1);
  const {
    control,
    handleSubmit,
    register,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormData>({
    shouldUnregister: false,
  });

  const nextStep = async () => {
    const valid = await triggerValidation();
    if (valid) setStep((prev) => prev + 1);
  };

  const [errorMessage, setErrorMessage] = useState<[]>([]);

  const prevStep = () => setStep((prev) => prev - 1);

  const stepsDescription = [
    "Location & School",
    "Personal Details 1",
    "Personal Details 2",
    "Authentication",
  ];

  const { data: schoolData, isLoading: isSchools } = useGetAllSchools() as {
    data: { data: [] };
    isLoading: boolean;
  };
  const { data: regionData, isLoading: isRegions } = useGetAllRegions() as {
    data: { data: [] };
    isLoading: boolean;
  };
  const { data: countryData, isLoading: isCountries } =
    useGetAllCountries() as { data: { data: [] }; isLoading: boolean };
  const { data: nationalityData, isLoading: isNationalities } =
    useGetAllNationalities() as {
      data: Record<string, string>;
      isLoading: boolean;
    };

  const schoolOptions =
    schoolData?.data?.map(
      (school: {
        cityName: string;
        countryName: string;
        regionName: string;
        id: number;
        name: string;
      }) => ({
        value: school.id,
        label: `${school.name} - ${school.regionName}, ${school.cityName}, ${school.countryName}`,
      }),
    ) || [];

  const regionOptions =
    regionData?.data?.map(
      (region: {
        cityName: string;
        countryName: string;
        regionName: string;
        regionId: number;
        name: string;
      }) => ({
        value: region.regionId,
        label: `${region.regionName} - ${region.cityName}`,
      }),
    ) || [];

  const countryOptions = countryData?.data
    ? Object.entries(countryData.data).map(
        ([key, value]: [string, string]) => ({
          value: key,
          label: `+${key} (${value})`,
        }),
      )
    : [];

  const optionsNationalities = nationalityData?.data
    ? Object.entries(nationalityData.data).map(([key, value]) => ({
        value: key,
        label: `${value}`,
      }))
    : [];

  const { mutate, isPending: isSubmitting } = useSignUp();
  const onSubmit = (data: SignUpFormData) => {
    const formData = new FormData();

    const depositRequest = {
      about: data.request.about,
      birthDate: data.request.birthDate,
      countryCode: data.request.countryCode,
      email: data.request.email,
      gender: data.request.gender,
      name_ar: data.request.name_ar,
      name_fr: data.request.name_fr,
      name_en: data.request.name_en,
      nationality: data.request.nationality,
      nid: data.request.nid,
      number: data.request.number,
      occupation_ar: data.request.occupation_ar,
      occupation_fr: data.request.occupation_fr,
      occupation_en: data.request.occupation_en,
      password: data.request.password,
      qualification: data.request.qualification,
      regionId: data.request.regionId,
      schoolId: data.request.schoolId,
      subjects: data.request.subjects,
      username: data.request.username,
      student: {
        username: data.request.student.username,
        about: data.request.student.about,
        birthDate: data.request.student.birthDate,
        email: data.request.student.email,
        gender: data.request.student.gender,
        language: data.request.student.language,
        name_ar: data.request.student.name_ar,
        name_fr: data.request.student.name_fr,
        name_en: data.request.student.name_en,
        nid: data.request.student.nid,
        password: data.request.student.password,
        relationshipToStudent: "FATHER",
        // TODO: Make it dynamic
        eduSystemId: "1",
        hasScholarship: "0",
        department: "SCIENTIFIC",
        studyLevel: "GRADE11",
        subDepartment: "MATHEMATICAL_SCIENCES",
      },
    };

    formData.append("request", JSON.stringify(depositRequest));
    if (
      data.parentIdPhoto &&
      data.parentIdPhoto instanceof FileList &&
      data.parentIdPhoto.length > 0
    ) {
      formData.append("parentIdPhoto", data.parentIdPhoto[0]!);
    }
    if (
      data.studentCertificatesOfAchievement &&
      data.studentCertificatesOfAchievement instanceof FileList &&
      data.studentCertificatesOfAchievement.length > 0
    ) {
      formData.append(
        "studentCertificatesOfAchievement",
        data.studentCertificatesOfAchievement[0]!,
      );
    }
    if (
      data.studentIdPhoto &&
      data.studentIdPhoto instanceof FileList &&
      data.studentIdPhoto.length > 0
    ) {
      formData.append("studentIdPhoto", data.studentIdPhoto[0]!);
    }
    if (
      data.studentProfilePhoto &&
      data.studentProfilePhoto instanceof FileList &&
      data.studentProfilePhoto.length > 0
    ) {
      formData.append("studentProfilePhoto", data.studentProfilePhoto[0]!);
    }
    mutate(formData as unknown as Partial<SignUpFormData>, {
      onSuccess: () => {
        toast.success("Form submitted successfully!");
      },
      onError: (
        err: Error & { response?: { data: { message: string; data: [] } } },
      ) => {
        if (err.response?.data) {
          toast.error(err.response.data.message);
          setErrorMessage(err.response.data.data);
        } else {
          toast.error(err.message);
        }
      },
    });
  };

  // Function to trigger validation for the current step
  const triggerValidation = async () => {
    let fieldsToValidate: (keyof SignUpFormData["request"])[] = [];
    switch (step) {
      case 1:
        fieldsToValidate = ["username", "email", "schoolId", "regionId"];
        break;
      case 2:
        fieldsToValidate = ["name_en", "name_fr", "name_ar"];
        break;
      case 3:
        fieldsToValidate = ["occupation_en", "occupation_fr", "occupation_ar"];
        break;
      case 4:
        fieldsToValidate = ["password", "nationality"];
        break;
      case 5:
        fieldsToValidate = [
          "gender",
          "nid",
          "birthDate",
          "countryCode",
          "number",
        ];
        break;
      default:
        break;
    }

    const mappedFieldsToValidate = fieldsToValidate.map(
      (field) => `request.${field}` as const,
    );

    const result = await trigger(mappedFieldsToValidate);
    return result;
  };

  if (isSchools || isRegions || isCountries || isNationalities) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bgSecondary duration-300 ease-in">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bgSecondary duration-300 ease-in">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={150}
            height={40}
            className="w-[120px] md:w-[150px]"
          />
        </Link>
      </div>
      <div className="flex w-full max-w-2xl flex-col items-center p-4 md:p-8">
        <Text font={"bold"} size={"4xl"} className="mb-4">
          Sign Up
        </Text>

        {/* Steps */}
        <div className="mb-20 p-4 flex w-full flex-col items-center justify-center sm:flex-row">
          <div className="flex flex-wrap items-center justify-center md:flex-nowrap">
            {[1, 2, 3, 4, 5, 6, 7].map((stepIndex, index) => (
              <React.Fragment key={stepIndex}>
                <div
                  className={`relative mb-10 flex h-6 w-6 items-center justify-center rounded-full ${
                    index < step ? "bg-primary" : "bg-gray-300"
                  } text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm`}
                >
                  {stepIndex}
                  <Text className="absolute -left-[15px] top-8 w-[80px] text-[8px] text-textPrimary sm:-left-[22px] sm:top-10 sm:w-[100px] sm:text-xs">
                    {stepsDescription[index]}
                  </Text>
                </div>
                {index < 6 && (
                  <hr
                    className={`h-[5px] mb-10 w-16 ${
                      index < step - 1 ? "bg-primary" : "bg-gray-300"
                    } sm:h-[5px] sm:w-[105px]`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <label htmlFor="username" className="">
                <Input
                  {...register("request.username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  error={errors.request?.username?.message?.toString() ?? ""}
                  placeholder="Username"
                  theme="transparent"
                />
                {errors.request?.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.username.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="email" className="block">
                <Input
                  error={errors.request?.email?.message?.toString() ?? ""}
                  {...register("request.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="E-mail"
                  theme="transparent"
                />
                {errors.request?.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.email.message?.toString()}
                  </p>
                )}
              </label>

              <label htmlFor="school" className="block">
                <Controller
                  name="request.schoolId"
                  control={control}
                  rules={{ required: "School selection is required" }}
                  defaultValue="" // Initialize with a default value
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      error={
                        errors.request?.schoolId?.message?.toString() ?? ""
                      }
                      value={value}
                      onChange={onChange}
                      placeholder="Select School"
                      options={schoolOptions}
                    />
                  )}
                />
              </label>
              <label htmlFor="regionId" className="block">
                <Controller
                  name="request.regionId"
                  control={control}
                  rules={{ required: "Region selection is required" }}
                  defaultValue="" // Initialize with a default value
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      error={
                        errors.request?.regionId?.message?.toString() ?? ""
                      }
                      value={value}
                      onChange={onChange}
                      placeholder="Select Region"
                      options={regionOptions}
                    />
                  )}
                />
              </label>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <label htmlFor="name_en" className="block">
                <Input
                  error={errors.request?.name_en?.message?.toString() ?? ""}
                  {...register("request.name_en", {
                    required: "English name is required",
                  })}
                  placeholder="Full Name (English)"
                  theme="transparent"
                />
                {errors.request?.name_en && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.name_en.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="name_fr" className="block">
                <Input
                  error={errors.request?.name_fr?.message?.toString() ?? ""}
                  {...register("request.name_fr", {
                    required: "French name is required",
                  })}
                  placeholder="Full Name (French)"
                  theme="transparent"
                />
                {errors.request?.name_fr && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request.name_fr.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="name_ar" className="block">
                <Input
                  error={errors.request?.name_ar?.message?.toString() ?? ""}
                  {...register("request.name_ar", {
                    required: "Arabic name is required",
                  })}
                  placeholder="Full Name (Arabic)"
                  theme="transparent"
                />
                {errors.request?.name_ar && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.name_ar.message?.toString()}
                  </p>
                )}
              </label>

              <div className="flex space-x-4">
                <Button type="button" onClick={prevStep} theme="outline">
                  Prev
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <label htmlFor="occupation_en" className="block">
                <Input
                  error={
                    errors.request?.occupation_en?.message?.toString() ?? ""
                  }
                  {...register("request.occupation_en", {
                    required: "English Occupation is required",
                  })}
                  placeholder="Occupation (English)"
                  theme="transparent"
                />
                {errors.request?.occupation_en && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.occupation_en.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="occupation_fr" className="block">
                <Input
                  error={
                    errors.request?.occupation_fr?.message?.toString() ?? ""
                  }
                  {...register("request.occupation_fr", {
                    required: "French Occupation is required",
                  })}
                  placeholder="Occupation (French)"
                  theme="transparent"
                />
                {errors.request?.occupation_fr && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.occupation_fr.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="occupation_ar" className="block">
                <Input
                  error={
                    errors.request?.occupation_ar?.message?.toString() ?? ""
                  }
                  {...register("request.occupation_ar", {
                    required: "Arabic Occupation is required",
                  })}
                  placeholder="Occupation (Arabic)"
                  theme="transparent"
                />
                {errors.request?.occupation_ar && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.occupation_ar.message?.toString()}
                  </p>
                )}
              </label>

              <div className="flex space-x-4">
                <Button type="button" onClick={prevStep} theme="outline">
                  Prev
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <label htmlFor="password" className="block">
                <Input
                  error={errors.request?.password?.message?.toString() ?? ""}
                  {...register("request.password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Password"
                  type="password"
                  theme="transparent"
                />
                {errors.request?.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.password.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="nationality" className="block">
                <Controller
                  name="request.nationality"
                  control={control}
                  rules={{ required: "Nationality is required" }}
                  defaultValue="" // Initialize with a default value
                  render={({ field: { onChange, value } }) => (
                    <SearchableSelect
                      error={
                        errors.request?.nationality?.message?.toString() ?? ""
                      }
                      value={value}
                      onChange={onChange}
                      placeholder="Select Nationality"
                      options={optionsNationalities}
                    />
                  )}
                />
              </label>
              <label htmlFor="about" className="block">
                <textarea
                  {...register("request.about")}
                  id="about"
                  placeholder="Write a brief summary about yourself. (Optional)"
                  className="w-full rounded-lg border border-borderPrimary bg-bgSecondary p-3 text-gray-700 outline-none transition duration-200 ease-in"
                ></textarea>
              </label>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <Button type="button" onClick={prevStep} theme="outline">
                  Prev
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <label htmlFor="gender" className="block">
                <Controller
                  name="request.gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  defaultValue="" // Initialize with a default value
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger
                        className={`w-full border ${errors.request?.gender ? "border-error" : ""}`}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.request?.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.gender.message?.toString()}
                  </p>
                )}
              </label>

              <label htmlFor="nid" className="block">
                <Input
                  {...register("request.nid", {
                    required: "National ID is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Invalid National ID format",
                    },
                  })}
                  error={errors.request?.nid?.message?.toString()}
                  placeholder="National ID"
                  className="-mt-1"
                  theme="transparent"
                />
                {errors.request?.nid && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.nid.message?.toString()}
                  </p>
                )}
              </label>

              <label htmlFor="birthDate" className="block">
                <Input
                  {...register("request.birthDate", {
                    required: "Date of birth is required",
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDifference =
                        today.getMonth() - birthDate.getMonth();

                      // Adjust age if the current month and day are before the birth month and day
                      if (
                        monthDifference < 0 ||
                        (monthDifference === 0 &&
                          today.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }

                      return age >= 20 || "You must be at least 20 years old";
                    },
                  })}
                  error={errors.request?.birthDate?.message?.toString()}
                  type="date"
                  placeholder="Date of birth"
                  className="!mb-2 !mt-2"
                  theme="transparent"
                />
                {errors.request?.birthDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.birthDate.message?.toString()}
                  </p>
                )}
              </label>

              <div className="mt-3 flex space-x-2">
                <label htmlFor="country_code" className="block w-1/3">
                  <Controller
                    name="request.countryCode"
                    control={control}
                    rules={{ required: "Country code is required" }}
                    defaultValue="" // Initialize with a default value
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        error={
                          errors.request?.countryCode?.message?.toString() ?? ""
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Country"
                        options={countryOptions}
                      />
                    )}
                  />
                </label>

                <label htmlFor="number" className="block w-2/3 translate-y-1">
                  <Input
                    {...register("request.number", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: "Invalid phone number format",
                      },
                    })}
                    type="tel"
                    error={errors.request?.number?.message?.toString()}
                    placeholder="Phone Number"
                    className="-mt-[4px]"
                    theme="transparent"
                  />
                  {errors.request?.number && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.request?.number?.message?.toString()}
                    </p>
                  )}
                </label>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <Button type="button" onClick={prevStep} theme="outline">
                  Prev
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
                {/* <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sign Up..." : "Sign Up"}
                </Button> */}
              </div>

              {/* Display Submission Error */}
              <p className="mt-4 text-center text-sm text-red-500">
                {Array.isArray(errorMessage) &&
                  errorMessage.map((err: string, index: number) => (
                    <div key={index}>
                      <p>{err}</p>
                    </div>
                  ))}
              </p>
            </>
          )}
          {step === 6 && (
            <>
              <Text font="medium" className="mb-10">
                Student Data
              </Text>
              <label htmlFor="username" className="">
                <Input
                  {...register("request.student.username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  error={
                    errors.request?.student?.username?.message?.toString() ?? ""
                  }
                  placeholder="Username"
                  theme="transparent"
                />
                {errors.request?.student?.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student?.username.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="email" className="block">
                <Input
                  error={
                    errors.request?.student?.email?.message?.toString() ?? ""
                  }
                  {...register("request.student.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="E-mail"
                  theme="transparent"
                />
                {errors.request?.student?.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student?.email.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="name_en" className="block">
                <Input
                  error={
                    errors.request?.student?.name_en?.message?.toString() ?? ""
                  }
                  {...register("request.student.name_en", {
                    required: "English name is required",
                  })}
                  placeholder="Full Name (English)"
                  theme="transparent"
                />
                {errors.request?.student?.name_en && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student.name_en.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="name_fr" className="block">
                <Input
                  error={
                    errors.request?.student?.name_fr?.message?.toString() ?? ""
                  }
                  {...register("request.student.name_fr", {
                    required: "French name is required",
                  })}
                  placeholder="Full Name (French)"
                  theme="transparent"
                />
                {errors.request?.student?.name_fr && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request.student.name_fr.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="name_ar" className="block">
                <Input
                  error={
                    errors.request?.student?.name_ar?.message?.toString() ?? ""
                  }
                  {...register("request.student.name_ar", {
                    required: "Arabic name is required",
                  })}
                  placeholder="Full Name (Arabic)"
                  theme="transparent"
                />
                {errors.request?.student?.name_ar && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student.name_ar.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="gender" className="block">
                <Controller
                  name="request.student.gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  defaultValue="" // Initialize with a default value
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger
                        className={`w-full border ${errors.request?.student?.gender ? "border-error" : ""}`}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.request?.student?.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student.gender.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="password" className="block">
                <Input
                  error={
                    errors.request?.student?.password?.message?.toString() ?? ""
                  }
                  {...register("request.student.password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Password"
                  type="password"
                  theme="transparent"
                />
                {errors.request?.student?.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student.password.message?.toString()}
                  </p>
                )}
              </label>

              <div className="mt-8 flex justify-center space-x-4">
                <Button type="button" onClick={prevStep} theme="outline">
                  Prev
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 7 && (
            <>
              <label htmlFor="nid" className="block">
                <Input
                  {...register("request.student.nid", {
                    required: "National ID is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Invalid National ID format",
                    },
                  })}
                  error={errors.request?.student?.nid?.message?.toString()}
                  placeholder="National ID"
                  className="-mt-1"
                  theme="transparent"
                />
                {errors.request?.student?.nid && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student.nid.message?.toString()}
                  </p>
                )}
              </label>

              <label htmlFor="birthDate" className="block">
                <Input
                  {...register("request.student.birthDate", {
                    required: "Date of birth is required",
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDifference =
                        today.getMonth() - birthDate.getMonth();

                      // Adjust age if the current month and day are before the birth month and day
                      if (
                        monthDifference < 0 ||
                        (monthDifference === 0 &&
                          today.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }

                      return age >= 20 || "You must be at least 20 years old";
                    },
                  })}
                  error={errors.request?.student?.birthDate?.message?.toString()}
                  type="date"
                  placeholder="Date of birth"
                  className="!mb-2 !mt-2"
                  theme="transparent"
                />
                {errors.request?.student?.birthDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request?.student.birthDate.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="nid" className="block">
                <Input
                  {...register("parentIdPhoto", {
                    required: "parentIdPhoto is required",
                  })}
                  type="file"
                  error={errors.parentIdPhoto?.message?.toString()}
                  placeholder="parentIdPhoto"
                  className="-mt-1"
                  label="parentIdPhoto"
                  theme="transparent"
                />
                {errors.parentIdPhoto && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.parentIdPhoto.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="nid" className="block">
                <Input
                  {...register("studentIdPhoto", {
                    required: "studentIdPhoto is required",
                  })}
                  type="file"
                  error={errors.studentIdPhoto?.message?.toString()}
                  placeholder="studentIdPhoto"
                  label="studentIdPhoto"
                  className="-mt-1"
                  theme="transparent"
                />
                {errors.studentIdPhoto && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studentIdPhoto.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="nid" className="block">
                <Input
                  {...register("studentProfilePhoto", {
                    required: "studentProfilePhoto is required",
                  })}
                  type="file"
                  error={errors.studentProfilePhoto?.message?.toString()}
                  placeholder="studentProfilePhoto"
                  className="-mt-1"
                  label="studentProfilePhoto"
                  theme="transparent"
                />
                {errors.studentProfilePhoto && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studentProfilePhoto.message?.toString()}
                  </p>
                )}
              </label>
              <label htmlFor="nid" className="block text-start">
                <Input
                  {...register("studentCertificatesOfAchievement", {
                    required: "studentCertificatesOfAchievement is required",
                  })}
                  type="file"
                  error={errors.studentCertificatesOfAchievement?.message?.toString()}
                  placeholder="studentCertificatesOfAchievement"
                  className="-mt-1"
                  label="studentCertificatesOfAchievement"
                  theme="transparent"
                />
                {errors.studentCertificatesOfAchievement && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studentCertificatesOfAchievement.message?.toString()}
                  </p>
                )}
              </label>

              <div className="mt-8 flex justify-center space-x-4">
                <Button type="button" onClick={prevStep} theme="outline">
                  Prev
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sign Up..." : "Sign Up"}
                </Button>
              </div>
            </>
          )}
          {/* Sign-in Prompt */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            <p className="text-sm text-gray-500">Already have an account?</p>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
