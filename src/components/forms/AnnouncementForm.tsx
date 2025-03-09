"use client";

import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { Class } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-toastify";

interface AnnouncementFormProps {
  type: "create" | "update";
  setOpen: (open: boolean) => void;
  data?: any;
  relatedData?: { classes: Class[] };
}

const SubmitButton = ({ type }: { type: "create" | "update" }) => {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className="mt-2 p-4 bg-blue-600 text-white font-medium border-none rounded-lg w-full hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#151c2c] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <span>Submitting...</span>
      ) : (
        <span>{type === "create" ? "Create Announcement" : "Update Announcement"}</span>
      )}
    </button>
  );
};

const AnnouncementForm = ({
  type,
  setOpen,
  data,
  relatedData,
}: AnnouncementFormProps) => {
  const initialState = { message: "", errors: null };
  const createAnnouncementWithClass = createAnnouncement.bind(null);
  const updateAnnouncementWithId = updateAnnouncement.bind(
    null,
    data?.id
  );
  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncementWithClass : updateAnnouncementWithId,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      if (!state.errors) {
        setOpen(false);
        toast.success(state.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.refresh();
      } else {
        toast.error(state.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  }, [state, setOpen, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-white text-sm font-medium">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter announcement title"
          name="title"
          defaultValue={data?.title}
          className="p-4 bg-[#151c2c] rounded-lg border-2 border-[#2e374a] text-white text-base focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-white text-sm font-medium">Description</label>
        <textarea
          id="description"
          placeholder="Enter announcement description"
          name="description"
          defaultValue={data?.description}
          className="p-4 bg-[#151c2c] rounded-lg border-2 border-[#2e374a] text-white text-base focus:border-blue-500 focus:outline-none transition-all min-h-[120px] resize-y placeholder:text-gray-400"
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="classId" className="text-white text-sm font-medium">Target Class</label>
        <select
          id="classId"
          name="classId"
          defaultValue={data?.classId || ""}
          className="p-4 bg-[#151c2c] rounded-lg border-2 border-[#2e374a] text-white text-base focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#151c2c]">Select Class (Optional)</option>
          {relatedData?.classes?.map((classItem) => (
            <option key={classItem.id} value={classItem.id} className="bg-[#151c2c]">
              {classItem.name}
            </option>
          ))}
        </select>
      </div>

      <SubmitButton type={type} />

      {state?.errors && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg border border-red-500/20">
          {Object.entries(state.errors).map(([key, value]) => (
            <p key={key} className="text-sm">
              {key}: {value}
            </p>
          ))}
        </div>
      )}
    </form>
  );
};

export default AnnouncementForm;
