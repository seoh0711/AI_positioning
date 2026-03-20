"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, BookOpen, ChevronRight } from "lucide-react";
import type { EbookContent, EbookChapter } from "@/types/ebook";

interface EbookViewerProps {
  content: EbookContent | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  lang: "ko" | "en";
}

export default function EbookViewer({
  content,
  isOpen,
  isLoading,
  onClose,
  lang,
}: EbookViewerProps) {
  const [selectedChapter, setSelectedChapter] = useState(0);

  const visible = isOpen || isLoading;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ebook-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="ebook-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-5xl mx-4 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1e1e1e",
              maxHeight: "90vh",
            }}
          >
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 px-8">
                <Loader2
                  className="animate-spin mb-4"
                  size={40}
                  style={{ color: "#f0f0f0" }}
                />
                <p style={{ color: "#f0f0f0" }} className="text-base">
                  {lang === "ko"
                    ? "전자책을 생성하고 있습니다..."
                    : "Generating ebook..."}
                </p>
              </div>
            )}

            {/* Content state */}
            {!isLoading && content && (
              <div className="flex flex-col" style={{ maxHeight: "90vh" }}>
                {/* Top bar */}
                <div
                  className="flex items-center justify-between px-6 py-4 shrink-0"
                  style={{
                    borderBottom: "1px solid #1e1e1e",
                    backgroundColor: "#0d0d0d",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BookOpen size={18} style={{ color: "#a0a0a0", flexShrink: 0 }} />
                    <div className="min-w-0">
                      <h2
                        className="text-sm font-semibold truncate"
                        style={{ color: "#f0f0f0" }}
                      >
                        {content.title[lang]}
                      </h2>
                      <p className="text-xs truncate" style={{ color: "#666" }}>
                        {content.subtitle[lang]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-1.5 rounded-lg transition-colors shrink-0"
                    style={{ color: "#a0a0a0" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1e1e1e")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body: sidebar + main */}
                <div className="flex overflow-hidden flex-1">
                  {/* Sidebar TOC */}
                  <div
                    className="w-64 shrink-0 overflow-y-auto py-4"
                    style={{
                      borderRight: "1px solid #1e1e1e",
                      backgroundColor: "#080808",
                    }}
                  >
                    <p
                      className="px-4 mb-3 text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#555" }}
                    >
                      {lang === "ko" ? "목차" : "Contents"}
                    </p>
                    <ul className="space-y-0.5 px-2">
                      {content.chapters.map((chapter, idx) => {
                        const active = idx === selectedChapter;
                        return (
                          <li key={idx}>
                            <button
                              onClick={() => setSelectedChapter(idx)}
                              className="w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2 group"
                              style={{
                                backgroundColor: active ? "#1e1e1e" : "transparent",
                                color: active ? "#f0f0f0" : "#888",
                              }}
                              onMouseEnter={(e) => {
                                if (!active)
                                  e.currentTarget.style.backgroundColor = "#141414";
                              }}
                              onMouseLeave={(e) => {
                                if (!active)
                                  e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <ChevronRight
                                size={14}
                                className="mt-0.5 shrink-0 transition-transform"
                                style={{
                                  color: active ? "#f0f0f0" : "#555",
                                  transform: active ? "rotate(90deg)" : "rotate(0deg)",
                                }}
                              />
                              <span className="text-xs leading-relaxed">
                                {chapter.title[lang]}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Page count footer */}
                    <div
                      className="mx-4 mt-6 pt-4 text-xs"
                      style={{ borderTop: "1px solid #1e1e1e", color: "#444" }}
                    >
                      {lang === "ko"
                        ? `총 ${content.total_pages}페이지`
                        : `${content.total_pages} pages total`}
                    </div>
                  </div>

                  {/* Main content */}
                  <div
                    className="flex-1 overflow-y-auto px-8 py-8"
                    style={{ backgroundColor: "#0a0a0a" }}
                  >
                    {content.chapters[selectedChapter] && (
                      <ChapterView
                        chapter={content.chapters[selectedChapter]}
                        lang={lang}
                      />
                    )}

                    {/* Preview note */}
                    <div
                      className="mt-10 px-4 py-3 rounded-lg text-xs"
                      style={{
                        backgroundColor: "#111",
                        border: "1px solid #1e1e1e",
                        color: "#555",
                      }}
                    >
                      {content.preview_note[lang]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChapterView({
  chapter,
  lang,
}: {
  chapter: EbookChapter;
  lang: "ko" | "en";
}) {
  const paragraphs = chapter.content[lang]
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article>
      <h3
        className="text-xl font-bold mb-2 leading-snug"
        style={{ color: "#f0f0f0" }}
      >
        {chapter.title[lang]}
      </h3>
      <p className="text-xs mb-8" style={{ color: "#444" }}>
        {lang === "ko" ? "페이지" : "Pages"} {chapter.page_range}
      </p>
      <div className="space-y-5">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-sm leading-7" style={{ color: "#c0c0c0" }}>
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
