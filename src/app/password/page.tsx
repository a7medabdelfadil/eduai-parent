/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "~/_components/Button";
import Container from "~/_components/Container";
import Input from "~/_components/Input";
import { Text } from "~/_components/Text";
import {
  useChangePassword,
  useProfile,
} from "~/APIs/hooks/useProfile";
import useLanguageStore from "~/APIs/store";
import type { ChangePassword } from "~/types";

const ChangePassword = () => {
  const router = useRouter();
  const { data, isLoading } = useProfile();

  const language = useLanguageStore((state) => state.language);

  const translate = (en: string, fr: string, ar: string) => {
    return language === "fr" ? fr : language === "ar" ? ar : en;
  };

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const { mutate: changePasswordMutation } = useChangePassword();
  const handleSubmit = () => {
    if (newPassword !== confirmNewPassword) {
      toast.error(
        translate(
          "New password and confirm password must match.",
          "Le nouveau mot de passe et la confirmation doivent correspondre.",
          "يجب أن تكون كلمة المرور الجديدة وتأكيدها متطابقتين.",
        ),
      );
      return;
    }

    const payload: ChangePassword = {
      password: currentPassword,
      newPassword,
    };

    changePasswordMutation(payload, {
      onSuccess: () => {
        toast.success(
          translate(
            "Password changed successfully!",
            "Mot de passe modifié avec succès!",
            "تم تغيير كلمة المرور بنجاح!",
          ),
        );
        router.push("/");
      },
      onError: () => {
        toast.error(
          translate(
            "Failed to change password. Please try again.",
            "Échec de la modification du mot de passe. Veuillez réessayer.",
            "فشل تغيير كلمة المرور. يرجى المحاولة مرة أخرى.",
          ),
        );
      },
    });
  };

  return (
    <>
      <Container>
        <div
          dir={language == "ar" ? "rtl" : "ltr"}
          className="w-full overflow-x-hidden rounded-xl bg-bgPrimary p-4"
        >
          <Text font={"bold"} size={"4xl"}>
            {translate(
              "Edit Profile",
              "Modifier le profil",
              "تعديل الملف الشخصي",
            )}
          </Text>
          <div className="mt-4 flex flex-col items-center">
            <div>
              <img
                src={data?.data?.picture ?? "/images/userr.png"}
                alt="Profile Photo"
                width={100}
                height={100}
                className="inline-block h-24 w-24 rounded-full ring-2 ring-bgSecondary"
              />
            </div>
            <div className="flex flex-col items-center">
              <Text font={"bold"} size={"2xl"} className="mt-2">
                {data?.data.name}
              </Text>
              <Text size={"xl"} color="gray" className="mb-2">
                @{data?.data.username}
              </Text>
            </div>
          </div>
          <div className="m-auto w-4/5">
            <div className="flex flex-col gap-8 md:flex-row">
              <div>
                <a
                  href="/profile"
                  className="text-xl hover:text-primary hover:underline"
                >
                  {translate(
                    "Personal Info.",
                    "Infos personnelles",
                    "المعلومات الشخصية",
                  )}
                </a>
              </div>
              <div>
                <a href="/password" className="text-xl text-primary underline">
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
                <label htmlFor="current_password">
                  {" "}
                  {translate(
                    "Current Password",
                    "Mot de passe actuel",
                    "كلمة المرور الحالية",
                  )}
                </label>
                <Input
                  placeholder={translate(
                    "Enter current password",
                    "Entrez le mot de passe actuel",
                    "أدخل كلمة المرور الحالية",
                  )}
                  type="password"
                  id="current_password"
                  theme="transparent"
                  border="gray"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} // Update state on change
                />
              </div>
              <div>
                <label htmlFor="new_password">
                  {" "}
                  {translate(
                    "New Password",
                    "Nouveau mot de passe",
                    "كلمة المرور الجديدة",
                  )}
                </label>
                <Input
                  placeholder={translate(
                    "Enter new password",
                    "Entrez un nouveau mot de passe",
                    "أدخل كلمة مرور جديدة",
                  )}
                  type="password"
                  id="new_password"
                  theme="transparent"
                  border="gray"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} // Update state on change
                />
              </div>
              <div>
                <label htmlFor="confirm_new_password">
                  {translate(
                    "Confirm New Password",
                    "Confirmez le nouveau mot de passe",
                    "تأكيد كلمة المرور الجديدة",
                  )}
                </label>
                <Input
                  placeholder={translate(
                    "Confirm the password",
                    "Confirmez le mot de passe",
                    "أكد كلمة المرور",
                  )}
                  type="password"
                  id="confirm_new_password"
                  theme="transparent"
                  border="gray"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)} // Update state on change
                />
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
        </div>
      </Container>
    </>
  );
};

export default ChangePassword;
