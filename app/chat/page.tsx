"use client";
import ChatView from "@/components/ChatView";
import Header from "@/components/Header";
import SummaryAndStats from "@/components/SummaryAndStats";
import { FileUploadContext } from "@/context/file";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

type Props = {};

const Chat = (props: Props) => {
  const { selectedFile, setKey, key } = useContext(FileUploadContext);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("key");
    setKey(key);

    console.log(key);

    async function createIndexAndEmbeddings(file, key) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("key", key);
      setLoading(true);

      try {
        const result = await fetch("/api/setup", {
          method: "POST",
          body: formData,
        });

        const json = await result.json();

        const data = json.data;

        if (data.success) {
          alert(`yeahh`);
        } else {
          router.push("");
        }

        console.log(`result`, json);
      } catch (err) {
        console.log(`err: `, err);
      } finally {
        setLoading(false);
      }
    }
    if (!key) {
      router.push("/");
    }

    if (selectedFile && key) {
      createIndexAndEmbeddings(selectedFile, key);
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full">
        <Image
          src={"/load.gif"}
          alt="load"
          style={{ objectFit: "contain" }}
          // className="h-auto w-full"
          fill
        />
      </div>
    );

  return (
    <>
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2   h-screen">
          <SummaryAndStats />
          <ChatView />
        </div>
      )}
    </>
  );
};

export default Chat;
