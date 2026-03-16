export type CartItem = {
  id: string
  type: "tool" | "course"
  name: string
  image: string
  icon?: string
  duration?: string // for tools: "1 tháng" | "1 năm"
  price: number
  originalPrice: number
  quantity: number
}

export type Order = {
  id: string
  date: string
  status: "pending" | "processing" | "completed" | "cancelled"
  items: Array<{ name: string; type: "tool" | "course"; price: number; icon: string }>
  total: number
  paymentMethod: string
}

export type Course = {
  id: string
  slug: string
  title: string
  subtitle: string
  instructor: { name: string; avatar: string; bio: string; students: number; rating: number }
  thumbnail: string
  previewVideo: string
  rating: number
  reviewCount: number
  studentCount: number
  duration: string
  lessons: number
  level: "Cơ bản" | "Trung cấp" | "Nâng cao"
  language: string
  lastUpdated: string
  price: number
  originalPrice: number
  tags: string[]
  description: string
  outcomes: string[]
  requirements: string[]
  curriculum: CourseChapter[]
}

export type CourseChapter = {
  id: string
  title: string
  duration: string
  lessons: CoursLesson[]
}

export type CoursLesson = {
  id: string
  title: string
  duration: string
  type: "video" | "quiz" | "article" | "assignment"
  free?: boolean
  completed?: boolean
}

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "c1",
    type: "course",
    name: "AI Thực Chiến: ChatGPT, Midjourney & Automation",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80",
    duration: undefined,
    price: 990000,
    originalPrice: 1990000,
    quantity: 1,
  },
  {
    id: "t1",
    type: "tool",
    name: "ChatGPT Plus",
    image: "https://images.unsplash.com/photo-1676573694977-38c1e39e03ed?w=400&q=80",
    icon: "🤖",
    duration: "1 tháng",
    price: 350000,
    originalPrice: 500000,
    quantity: 1,
  },
  {
    id: "t2",
    type: "tool",
    name: "Midjourney Pro",
    image: "https://images.unsplash.com/photo-1697577418970-9554f21f7a3b?w=400&q=80",
    icon: "🎨",
    duration: "1 tháng",
    price: 600000,
    originalPrice: 800000,
    quantity: 1,
  },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: "VP-2024-001",
    date: "2024-03-14T10:30:00",
    status: "completed",
    items: [
      { name: "AI Thực Chiến", type: "course", price: 990000, icon: "📚" },
      { name: "ChatGPT Plus 1 tháng", type: "tool", price: 350000, icon: "🤖" },
    ],
    total: 1340000,
    paymentMethod: "VietQR",
  },
  {
    id: "VP-2024-002",
    date: "2024-03-10T14:20:00",
    status: "completed",
    items: [
      { name: "Midjourney Pro 1 tháng", type: "tool", price: 600000, icon: "🎨" },
    ],
    total: 600000,
    paymentMethod: "MoMo",
  },
  {
    id: "VP-2024-003",
    date: "2024-03-05T09:15:00",
    status: "processing",
    items: [
      { name: "ElevenLabs Creator", type: "tool", price: 432000, icon: "🎙️" },
      { name: "Khóa học Prompt Engineering", type: "course", price: 590000, icon: "✨" },
    ],
    total: 1022000,
    paymentMethod: "ZaloPay",
  },
  {
    id: "VP-2024-004",
    date: "2024-02-28T16:45:00",
    status: "cancelled",
    items: [
      { name: "Sora AI 1 tháng", type: "tool", price: 1020000, icon: "🎬" },
    ],
    total: 1020000,
    paymentMethod: "VietQR",
  },
]

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    slug: "ai-thuc-chien",
    title: "AI Thực Chiến: ChatGPT, Midjourney & Automation",
    subtitle: "Làm chủ các công cụ AI hàng đầu — từ tạo nội dung đến tự động hóa công việc",
    instructor: {
      name: "Nguyễn Minh Khoa",
      avatar: "K",
      bio: "AI Expert & Founder tại VideoPrompt. 5+ năm kinh nghiệm ứng dụng AI trong kinh doanh.",
      students: 4820,
      rating: 4.9,
    },
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    previewVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    rating: 4.9,
    reviewCount: 847,
    studentCount: 4820,
    duration: "24 giờ 30 phút",
    lessons: 87,
    level: "Trung cấp",
    language: "Tiếng Việt",
    lastUpdated: "Tháng 3, 2024",
    price: 990000,
    originalPrice: 1990000,
    tags: ["ChatGPT", "Midjourney", "AI Automation", "Prompt Engineering"],
    description: "Khóa học toàn diện nhất về ứng dụng AI vào công việc và kinh doanh tại Việt Nam. Bạn sẽ học cách sử dụng ChatGPT, Midjourney, Claude và các công cụ AI khác một cách thực chiến — không chỉ dừng ở lý thuyết.",
    outcomes: [
      "Viết prompt chuyên nghiệp cho ChatGPT, Claude, Gemini",
      "Tạo ảnh thương mại chất lượng cao với Midjourney",
      "Tự động hóa workflow với Make.com và Zapier AI",
      "Xây dựng chatbot AI cho doanh nghiệp",
      "Tạo video marketing với Sora và RunwayML",
      "Phân tích dữ liệu nhanh chóng với AI",
    ],
    requirements: [
      "Máy tính kết nối internet",
      "Không cần kiến thức lập trình",
      "Có tài khoản ChatGPT (miễn phí ok)",
    ],
    curriculum: [
      {
        id: "ch1", title: "Giới thiệu & Setup môi trường", duration: "45 phút",
        lessons: [
          { id: "l1", title: "Chào mừng bạn đến với khóa học", duration: "5:20", type: "video", free: true, completed: true },
          { id: "l2", title: "Tổng quan các công cụ AI 2024", duration: "12:45", type: "video", free: true, completed: true },
          { id: "l3", title: "Setup tài khoản ChatGPT & Claude", duration: "8:30", type: "video", completed: true },
          { id: "l4", title: "Quiz: Kiểm tra kiến thức cơ bản", duration: "10 câu", type: "quiz", completed: false },
        ],
      },
      {
        id: "ch2", title: "ChatGPT Mastery — Prompt Engineering", duration: "5 giờ 20 phút",
        lessons: [
          { id: "l5", title: "Nguyên tắc viết prompt hiệu quả", duration: "18:30", type: "video", completed: false },
          { id: "l6", title: "Các framework prompt nổi tiếng (RTCF, CRISPE)", duration: "22:15", type: "video" },
          { id: "l7", title: "Prompt cho Marketing & Sales", duration: "35:00", type: "video" },
          { id: "l8", title: "Prompt cho Phân tích & Báo cáo", duration: "28:45", type: "video" },
          { id: "l9", title: "Thực hành: 10 prompt thực tế", duration: "45:00", type: "assignment" },
        ],
      },
      {
        id: "ch3", title: "Midjourney — Tạo ảnh AI Thương Mại", duration: "4 giờ",
        lessons: [
          { id: "l10", title: "Hiểu Midjourney Parameters", duration: "15:00", type: "video" },
          { id: "l11", title: "Tạo ảnh sản phẩm chuyên nghiệp", duration: "42:00", type: "video" },
          { id: "l12", title: "Ảnh chân dung & thời trang AI", duration: "38:00", type: "video" },
          { id: "l13", title: "Tạo visual cho Social Media", duration: "30:00", type: "video" },
        ],
      },
      {
        id: "ch4", title: "AI Automation với Make.com", duration: "6 giờ",
        lessons: [
          { id: "l14", title: "Giới thiệu Make.com (Integromat)", duration: "20:00", type: "video" },
          { id: "l15", title: "Workflow tự động hóa Email Marketing", duration: "55:00", type: "video" },
          { id: "l16", title: "Auto-post Social Media với AI", duration: "48:00", type: "video" },
          { id: "l17", title: "Chatbot AI cho Facebook Messenger", duration: "65:00", type: "video" },
          { id: "l18", title: "Project cuối khóa: Build automation hoàn chỉnh", duration: "90:00", type: "assignment" },
        ],
      },
    ],
  },
]
