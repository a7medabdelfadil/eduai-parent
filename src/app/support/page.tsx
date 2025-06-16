"use client";
import Image from "next/image";
import { type ChangeEvent, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Button from "~/_components/Button";
import Container from "~/_components/Container";
import Input from "~/_components/Input";
import { Text } from "~/_components/Text";
import useLanguageStore from "~/APIs/store";

const Support = () => {
  const [fileName, setFileName] = useState("");
  const language = useLanguageStore((state) => state.language);
  const translate = (en: string, fr: string, ar: string) => {
    return language === "fr" ? fr : language === "ar" ? ar : en;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <>
      <Container>
        <div
          dir={language == "ar" ? "rtl" : "ltr"}
          className="mt-8 w-full overflow-x-hidden rounded-xl bg-bgPrimary p-4"
        >
          <div className="flex h-[80vh] flex-col items-center justify-evenly gap-8 md:flex-row">
            {/* Light mode image */}
            <div className="hidden w-1/3 dark:hidden md:block">
              <Image
                src="/images/support.png"
                alt={translate("Support", "Support", "الدعم")}
                width={500}
                height={500}
              />
            </div>

            {/* Dark mode image */}
            <div className="hidden w-1/3 dark:block md:hidden">
              <Image
                src="/images/support-dark.png"
                alt={translate("Support", "Support", "الدعم")}
                width={500}
                height={500}
              />
            </div>

            <div className="w-full md:w-1/3">
              <div>
                <Text font={"bold"} size={"2xl"}>
                  {translate("Support", "Support", "الدعم")}
                </Text>
                <Text className="mt-4">
                  {translate(
                    "If you encounter any issues or have any inquiries, please provide the details below. You can also upload an image showing the problem. Our support team is here to assist you.",
                    "Si vous rencontrez des problèmes ou avez des questions, veuillez fournir les détails ci-dessous. Vous pouvez également télécharger une image montrant le problème. Notre équipe d'assistance est là pour vous aider.",
                    "إذا واجهت أي مشاكل أو كانت لديك استفسارات، يرجى تقديم التفاصيل أدناه. يمكنك أيضًا تحميل صورة توضح المشكلة. فريق الدعم هنا لمساعدتك.",
                  )}
                </Text>
              </div>
              <form className="mt-8 flex w-full flex-col gap-2">
                <div>
                  <Input
                    type="subject"
                    id="subject"
                    placeholder={translate("Subject", "Sujet", "الموضوع")}
                    theme="transparent"
                    border="gray"
                    className="mt-2"
                  />
                </div>
                <div>
                  <textarea
                    id="area"
                    placeholder={translate(
                      "Write the problem",
                      "Décrivez le problème",
                      "اكتب المشكلة",
                    )}
                    className="mt-4 w-full rounded-lg border border-borderPrimary bg-bgPrimary px-3 pb-8 pt-3 text-textPrimary outline-none transition duration-200 ease-in placeholder:text-textSecondary"
                  ></textarea>
                </div>
                <label className="h-[200px] rounded-xl border-2 border-dashed border-borderPrimary">
                  <div className="flex h-full flex-col items-center justify-center">
                    <AiOutlineCloudUpload
                      size={50}
                      className="text-textSecondary"
                    />
                    {fileName ? (
                      <Text className="mt-2 rounded-xl border border-borderPrimary px-4 py-2">
                        {fileName}
                      </Text>
                    ) : (
                      <Text color={"gray"}>
                        {" "}
                        {translate(
                          "Upload Image",
                          "Télécharger une image",
                          "تحميل صورة",
                        )}
                      </Text>
                    )}
                  </div>
                  <input
                    type="file"
                    className="opacity-0"
                    onChange={handleFileChange}
                  />
                </label>
                <div></div>
              </form>
              <div className="mt-8">
                <Button>{translate("Submit", "Soumettre", "إرسال")}</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Support;
