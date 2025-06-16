/* eslint-disable @next/next/no-img-element */
"use client";
import Container from "~/_components/Container";
import Input from "~/_components/Input";
import Spinner from "~/_components/Spinner";
import { Text } from "~/_components/Text";
import {
  useGetProfileUpdate,
  useProfile,
  useUpdateProfile,
  useUpdateProfilePicture,
} from "~/APIs/hooks/useProfile";
import { useState, useEffect, useRef } from "react";
import { type TeacherProfileUpdate } from "~/types";
import Button from "~/_components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import useLanguageStore from "~/APIs/store";
import ImageComponent from "~/_components/ImageSrc";

const EditProfile = () => {
  const router = useRouter();
  const { data, isLoading, refetch: refetchProfile } = useProfile();
  const {
    data: dataUpdate,
    isLoading: isLoadingdataUpdate,
    refetch: refetchDataUpdate,
  } = useGetProfileUpdate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");

  const language = useLanguageStore((state) => state.language);

  const translate = (en: string, fr: string, ar: string) => {
    return language === "fr" ? fr : language === "ar" ? ar : en;
  };

  useEffect(() => {
    if (data?.data) {
      setName(data.data.name || "");
      setPhone(dataUpdate?.data.phone || "");
      setGender(
        dataUpdate?.data.gender === "MALE"
          ? "MALE"
          : dataUpdate?.data.gender === "FEMALE"
            ? "FEMALE"
            : "MALE",
      );
    }
  }, [
    data,
    dataUpdate?.data.gender,
    dataUpdate?.data.nationality,
    dataUpdate?.data.phone,
  ]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value === "MALE" ? "MALE" : "FEMALE");
  };

  const { mutate: updateProfileMutation } = useUpdateProfile({
    onSuccess: () => {
      router.push("/");
      toast.success(
        translate(
          "Profile edited successfully!",
          "Profil modifié avec succès!",
          "تم تعديل الملف الشخصي بنجاح!",
        ),
      );
    },
  });

  const handleSubmit = () => {
    const updatedProfile: TeacherProfileUpdate = {
      username: dataUpdate?.data?.username || "",
      email: dataUpdate?.data?.email || "",
      name_ar: name,
      name_en: name,
      name_fr: name,
      phone: phone,
      gender,
      nationality: dataUpdate?.data?.nationality || "",
      birthDate: dataUpdate?.data?.birthDate || "",
      nid: dataUpdate?.data?.nid || "",
      religion: dataUpdate?.data?.religion || "",
      regionId: dataUpdate?.data?.regionId || "",
      about: dataUpdate?.data?.about || "",
      countryCode: "AU",
    };
    updateProfileMutation(updatedProfile);
    refetchDataUpdate();
    refetchProfile();
  };

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mutation = useUpdateProfilePicture({
    onSuccess: () => {
      toast.success(
        translate(
          "Profile picture updated successfully!",
          "Photo de profil mise à jour avec succès!",
          "تم تحديث الصورة الشخصية بنجاح!",
        ),
      );
      setUploading(false);
      refetchDataUpdate();
      refetchProfile();
    },
    onError: () => {
      toast.error(
        translate(
          "Failed to update profile picture. Please try again.",
          "Échec de la mise à jour de la photo de profil. Veuillez réessayer.",
          "فشل تحديث الصورة الشخصية. يرجى المحاولة مرة أخرى.",
        ),
      );
      setUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(
          translate(
            "Invalid file type. Please upload a JPG, PNG, or WEBP image.",
            "Type de fichier invalide. Veuillez télécharger une image JPG, PNG ou WEBP.",
            "نوع الملف غير صالح. يرجى تحميل صورة بصيغة JPG أو PNG أو WEBP.",
          ),
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          translate(
            "File size exceeds 5MB. Please upload a smaller image.",
            "La taille du fichier dépasse 5 Mo. Veuillez télécharger une image plus petite.",
            "حجم الملف يتجاوز 5 ميجابايت. يرجى تحميل صورة أصغر.",
          ),
        );
        return;
      }

      setPreview(URL.createObjectURL(file));
      setUploading(true);
      mutation.mutate(file);
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading || isLoadingdataUpdate) {
    return <Spinner />;
  }

  return (
    <>
      <Container>
        <div dir={language == "ar"? "rtl": "ltr"} className="w-full overflow-x-hidden rounded-xl bg-bgPrimary p-4">
          <Text font={"bold"} size={"4xl"}>
            {translate(
              "Edit Profile",
              "Modifier le profil",
              "تعديل الملف الشخصي",
            )}
          </Text>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative">
              <ImageComponent
                fallbackSrc="/images/noImage.png"
                priority={true}
                src={data?.data?.picture ?? null}
                alt={translate(
                  "Profile Photo",
                  "Photo de profil",
                  "الصورة الشخصية",
                )}
                width={100}
                height={100}
                className="inline-block h-24 w-24 rounded-full ring-2 ring-bgSecondary"
              />

              <div className="relative">
                <button
                  onClick={handleEditClick}
                  className="absolute -right-4 -top-4 mx-auto my-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary p-2 text-white shadow-lg"
                  aria-label={translate(
                    "Edit Profile Picture",
                    "Modifier la photo de profil",
                    "تعديل الصورة الشخصية",
                  )}
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  {uploading ? <Spinner size={20} /> : <MdEdit />}
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col items-center">
              <Text font={"bold"} size={"2xl"} className="mt-2">
                {data?.data?.name}
              </Text>
              <Text size={"xl"} color="gray" className="mb-2">
                @{data?.data?.username}
              </Text>
            </div>
          </div>
          <div className="m-auto w-4/5">
            <div className="flex flex-col gap-8 md:flex-row">
              <div>
                <a href="/profile" className="text-xl text-primary underline">
                  {translate(
                    "Personal Info.",
                    "Infos personnelles",
                    "المعلومات الشخصية",
                  )}
                </a>
              </div>
              <div>
                <a href="/password" className="text-xl hover:text-primary hover:underline">
                  {translate(
                    "Change Password",
                    "Changer le mot de passe",
                    "تغيير كلمة المرور",
                  )}
                </a>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name">
                  {translate("Name", "Nom", "الاسم")}
                </label>
                <Input
                  name="name"
                  placeholder={translate(
                    "Enter name",
                    "Entrez le nom",
                    "أدخل الاسم",
                  )}
                  theme="transparent"
                  border="gray"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div>
                <label htmlFor="phone">
                  {translate(
                    "Phone Number",
                    "Numéro de téléphone",
                    "رقم الهاتف",
                  )}
                </label>
                <Input
                  type="tel"
                  placeholder={translate(
                    "Phone Number",
                    "Numéro de téléphone",
                    "رقم الهاتف",
                  )}
                  pattern="^\\+?[1-9]\d{1,14}$"
                  theme="transparent"
                  border="gray"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>

              <div>
                <label htmlFor="gender">
                  {translate("Gender", "Genre", "الجنس")}
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="w-full rounded-lg border border-borderPrimary bg-bgPrimary p-3 text-textPrimary outline-none transition duration-200 ease-in"
                  value={gender}
                  onChange={handleGenderChange}
                >
                  <option value="MALE">
                    {translate("Male", "Homme", "ذكر")}
                  </option>
                  <option value="FEMALE">
                    {translate("Female", "Femme", "أنثى")}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="mt-4 w-[150px]">
              <Button
                className="rounded-lg bg-primary px-6 py-2 text-white"
                onClick={handleSubmit}
              >
                {translate(
                  "Save Changes",
                  "Enregistrer les modifications",
                  "حفظ التغييرات",
                )}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default EditProfile;
