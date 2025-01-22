import React, { useRef, useState } from "react";
import { useMsgStore } from "../store/msgStore";
import { Send, X, Image } from "lucide-react";
import toast from "react-hot-toast";
export const SendMsg = () => {
  const { sendMessages } = useMsgStore();
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setImg(reader.result);
    };
  };
  const removeImage = () => {
    setImg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return;
    try {
      await sendMessages({
        text: text.trim(),
        image: img,
      });
      setText("");
      setImg(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("error in handlde send msg", error);
      toast.error("Cannot send the message");
    }
  };

  return (
    <div className="p-4 w-full">
      {img && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={img}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${img ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !img}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
