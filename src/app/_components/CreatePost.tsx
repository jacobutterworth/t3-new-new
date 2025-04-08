"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "~/trpc/react";

export function CreatePost() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getLatest.invalidate();
      await utils.post.getLatestPosts.invalidate();
      setName("");
      setContent("");
      setImageUrl("");
      setPassword("");
      handleClose();
    },
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, handleClose]);

  const fabPosition = {
    x: "calc(50vw - 2rem)",
    y: "calc(50vh - 2rem)",
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isModalOpen ? (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="fixed right-8 bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg"
            aria-label="Create new post"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </motion.button>
        ) : (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{
                scale: 0,
                x: "calc(100vw - 5rem)", // FAB position from right
                y: "calc(100vh - 5rem)", // FAB position from bottom
                opacity: 0,
              }}
              animate={{
                scale: 1,
                x: 0,
                y: 0,
                opacity: 1,
              }}
              exit={{
                scale: 0,
                x: "calc(100vw - 5rem)", // FAB position from right
                y: "calc(100vh - 5rem)", // FAB position from bottom
                opacity: 0,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold"
                >
                  Create New Post
                </motion.h2>
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await createPost.mutateAsync({
                      title: name,
                      content: content,
                      imageUrl: imageUrl,
                      password: password,
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-32 rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none"
                />
                <motion.button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
                  disabled={createPost.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {createPost.isPending ? "Creating..." : "Create Post"}
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
