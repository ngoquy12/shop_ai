"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Play, Check, ChevronRight, ChevronLeft, ChevronDown,
  CheckCircle2, Clock, BookOpen, BarChart3, MessageSquare,
  FileText, Menu, X, Volume2, Settings, Maximize2,
  ThumbsUp, Send, StickyNote, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { MOCK_COURSES } from "@/lib/shop-data"

const course = MOCK_COURSES[0]
const allLessons = course.curriculum.flatMap((ch) =>
  ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title }))
)

const totalLessons = allLessons.length
const completedCount = allLessons.filter((l) => l.completed).length
const progress = Math.round((completedCount / totalLessons) * 100)

const TABS = [
  { id: "overview", label: "Tổng quan", icon: BookOpen },
  { id: "qa", label: "Hỏi & Đáp", icon: MessageSquare },
  { id: "notes", label: "Ghi chú", icon: StickyNote },
  { id: "resources", label: "Tài liệu", icon: FileText },
]

const MOCK_QA = [
  { author: "Lan N.", time: "2 ngày trước", q: "Làm thế nào để viết prompt cho ảnh thương mại Midjourney?", a: "Bạn cần chỉ định rõ subject, lighting, camera, style. Ví dụ: 'product photography of...'", likes: 12 },
  { author: "Hùng P.", time: "5 ngày trước", q: "Tôi có thể dùng ChatGPT Free cho khóa này không?", a: "Có thể, nhưng GPT-4 sẽ cho kết quả tốt hơn nhiều. Tuy nhiên GPT-3.5 vẫn đủ để hoàn thành 80% bài tập.", likes: 8 },
]

function VideoPlayer({ lesson }: { lesson: typeof allLessons[0] }) {
  return (
    <div className="relative bg-black w-full aspect-video">
      {/* Fake video UI */}
      <div
        className="w-full h-full flex items-center justify-center relative"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
        }}
      >
        {/* Lesson title overlay */}
        <div className="absolute top-4 left-4 right-4">
          <p className="text-white/60 text-xs">{lesson.chapterTitle}</p>
          <p className="text-white font-semibold text-sm sm:text-base">{lesson.title}</p>
        </div>

        {/* Center play area */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
          </div>
          <p className="text-white/50 text-sm">{lesson.duration}</p>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent px-4 py-3">
          {/* Progress bar */}
          <div className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer">
            <div className="h-full w-1/3 bg-blue-500 rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-white hover:text-white/80 transition-colors">
                <Play className="w-4 h-4 fill-white" />
              </button>
              <button className="text-white hover:text-white/80">
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="text-white/60 text-xs">4:23 / {lesson.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-white/60 hover:text-white text-xs">1x</button>
              <button className="text-white hover:text-white/80">
                <Settings className="w-4 h-4" />
              </button>
              <button className="text-white hover:text-white/80">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CurriculumSidebar({
  currentId,
  onSelect,
  onClose,
}: {
  currentId: string
  onSelect: (id: string) => void
  onClose?: () => void
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-bold text-sm">Nội dung khóa học</h2>
          <p className="text-xs text-muted-foreground">{completedCount}/{totalLessons} bài đã hoàn thành</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 shrink-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Tiến độ</span>
          <span className="font-bold text-blue-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {course.curriculum.map((chapter) => (
          <div key={chapter.id}>
            {/* Chapter header */}
            <div className="px-4 py-2.5 bg-muted/40 border-y border-border/30 sticky top-0">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide line-clamp-1">
                {chapter.title}
              </p>
            </div>

            {/* Lessons */}
            {chapter.lessons.map((lesson) => {
              const isActive = lesson.id === currentId
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelect(lesson.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
                    isActive
                      ? "bg-blue-500/10 border-r-2 border-blue-500"
                      : "hover:bg-accent/50"
                  )}
                >
                  {/* Status icon */}
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    lesson.completed
                      ? "bg-green-500/15"
                      : isActive
                        ? "bg-blue-500/15"
                        : "bg-muted"
                  )}>
                    {lesson.completed
                      ? <Check className="w-3 h-3 text-green-400" />
                      : lesson.type === "video"
                        ? <Play className={cn("w-3 h-3 ml-0.5", isActive ? "text-blue-400 fill-blue-400" : "text-muted-foreground fill-muted-foreground")} />
                        : lesson.type === "quiz"
                          ? <BarChart3 className="w-3 h-3 text-violet-400" />
                          : <BookOpen className="w-3 h-3 text-orange-400" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-xs font-medium line-clamp-2 leading-tight",
                      isActive ? "text-blue-400" : lesson.completed ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {lesson.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{lesson.duration}</p>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CourseLearnPage() {
  const [currentLessonId, setCurrentLessonId] = useState("l1")
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [notes, setNotes] = useState<string[]>([])

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) ?? allLessons[0]
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const prevLesson = allLessons[currentIndex - 1]
  const nextLesson = allLessons[currentIndex + 1]

  const saveNote = () => {
    if (!noteText.trim()) return
    setNotes((prev) => [`[${currentLesson.title}] ${noteText}`, ...prev])
    setNoteText("")
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top navbar */}
      <div className="h-14 border-b border-border/50 bg-card/90 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0 z-30">
        <Link
          href={`/courses/${course.slug}`}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:block">Quay lại</span>
        </Link>

        <div className="h-4 w-px bg-border/60" />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate">{course.title}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{progress}% hoàn thành</span>
            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-accent"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Video + Content ────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video */}
          <VideoPlayer lesson={currentLesson} />

          {/* Lesson nav */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/60 shrink-0">
            <button
              onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
              disabled={!prevLesson}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Bài trước
            </button>

            <div className="text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{currentIndex + 1}</span>/{totalLessons}
            </div>

            <button
              onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
              disabled={!nextLesson}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              Bài tiếp
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/50 bg-card/40 shrink-0 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
            {activeTab === "overview" && (
              <div className="space-y-5 animate-fade-in max-w-2xl">
                <div>
                  <h2 className="text-xl font-bold mb-1">{currentLesson.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{currentLesson.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{currentLesson.chapterTitle}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trong bài học này, bạn sẽ hiểu được cách hoạt động của các AI tools hàng đầu và cách ứng dụng chúng một cách hiệu quả trong công việc thực tế. Chúng ta sẽ đi qua các ví dụ thực tế và các bài tập để củng cố kiến thức.
                </p>

                <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 p-4">
                  <p className="text-sm font-semibold text-blue-400 mb-2">💡 Điểm chính cần nhớ</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />Hiểu được cơ chế hoạt động của Large Language Models</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />Setup tài khoản và môi trường làm việc tối ưu</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />So sánh các AI tools và chọn tool phù hợp nhất</li>
                  </ul>
                </div>

                <Button
                  onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Đánh dấu hoàn thành & Bài tiếp
                </Button>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="space-y-6 animate-fade-in max-w-2xl">
                <h2 className="font-bold">Hỏi & Đáp</h2>
                <div className="space-y-4">
                  {MOCK_QA.map((qa, i) => (
                    <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-sm font-bold text-blue-400 shrink-0">
                          {qa.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{qa.author}</span>
                            <span className="text-xs text-muted-foreground">{qa.time}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{qa.q}</p>
                        </div>
                      </div>
                      <div className="ml-11 rounded-xl bg-muted/30 border border-border/40 p-3">
                        <p className="text-xs font-semibold text-violet-400 mb-1">Giảng viên trả lời:</p>
                        <p className="text-sm text-muted-foreground">{qa.a}</p>
                      </div>
                      <div className="ml-11 flex items-center gap-3">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="w-3.5 h-3.5" /> {qa.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Đặt câu hỏi của bạn..."
                    className="text-sm resize-none"
                    rows={3}
                  />
                  <Button size="icon" className="shrink-0 bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4 animate-fade-in max-w-2xl">
                <h2 className="font-bold">Ghi chú của tôi</h2>
                <div className="flex gap-2">
                  <Textarea
                    placeholder={`Ghi chú cho bài: "${currentLesson.title}"...`}
                    value={noteText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                    className="text-sm resize-none"
                    rows={3}
                  />
                  <Button onClick={saveNote} size="icon" className="shrink-0 bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Chưa có ghi chú nào. Bắt đầu ghi lại những điểm quan trọng!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notes.map((note, i) => (
                      <div key={i} className="text-sm p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20 text-foreground">
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-4 animate-fade-in max-w-2xl">
                <h2 className="font-bold">Tài liệu bài học</h2>
                {[
                  { name: "Slides bài giảng.pdf", size: "2.4 MB" },
                  { name: "Prompt Templates.docx", size: "156 KB" },
                  { name: "Cheat Sheet AI Tools.pdf", size: "890 KB" },
                ].map((f) => (
                  <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover-lift cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.size}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Curriculum sidebar ─────────── */}
        {/* Desktop */}
        <div className="hidden lg:flex w-72 xl:w-80 border-l border-border/50 bg-card/40 flex-col shrink-0 overflow-hidden">
          <CurriculumSidebar currentId={currentLessonId} onSelect={setCurrentLessonId} />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="relative ml-auto w-72 h-full bg-card border-l border-border/50 flex flex-col animate-slide-in-right">
              <CurriculumSidebar
                currentId={currentLessonId}
                onSelect={(id) => { setCurrentLessonId(id); setSidebarOpen(false) }}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
