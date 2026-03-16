export type Category = {
  id: string
  label: string
}

export type AITool = {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  originalPrice: number
  salePrice: number
  discount: number
  hot?: boolean
  icon: string
  bgColor: string
  soldCount?: number
  externalUrl?: string
}

export type WebsiteService = {
  id: string
  name: string
  description: string
  features: string[]
  price: string
  badge?: string
  icon: string
  popular?: boolean
}

export type Course = {
  id: string
  name: string
  description: string
  lessons: number
  duration: string
  level: "Cơ bản" | "Trung cấp" | "Nâng cao"
  price: number
  originalPrice: number
  icon: string
  tags: string[]
  rating: number
  students: number
  new?: boolean
  bestseller?: boolean
}

export const aiToolCategories: Category[] = [
  { id: "all", label: "Tất cả" },
  { id: "video", label: "Video" },
  { id: "ai-chat", label: "AI Chat" },
  { id: "image-video", label: "Video, hình ảnh" },
  { id: "edit-video", label: "Edit video" },
  { id: "ai-chatbot", label: "AI Chatbot" },
  { id: "plus", label: "Plus" },
  { id: "ai-video", label: "AI video" },
  { id: "ai-analyze", label: "Video, hình ảnh, phân tích" },
]

export const aiTools: AITool[] = [
  {
    id: "1",
    name: "Picsart 2500 điểm để dùng Workspace AI",
    category: "video",
    description:
      "Đây là trang tổng hợp có sẵn credit để sử dụng VEO3, Sora2, Grok.. chứ không phải vào trực tiếp VEO3, Sora2, Grok..để sử dụng. Tài khoản chia sẻ đồng thời nhiều người.",
    tags: ["Tạo ảnh", "Tạo video đủ các loại VEO3, Sora2, Grok..", "Có chatGPT5"],
    originalPrice: 300000,
    salePrice: 250000,
    discount: 17,
    hot: true,
    icon: "P",
    bgColor: "#E91E8C",
    soldCount: 24,
    externalUrl: "https://picsart.com",
  },
  {
    id: "2",
    name: "Sora2 và Chat GPT plus",
    category: "video",
    description:
      "Tài khoản Sora2 chính chủ kết hợp ChatGPT Plus. Tạo video AI chất lượng cao, chat AI thông minh và sáng tạo nội dung không giới hạn.",
    tags: ["Tạo video Sora2", "ChatGPT Plus", "Không giới hạn tin nhắn"],
    originalPrice: 500000,
    salePrice: 350000,
    discount: 30,
    hot: true,
    icon: "S",
    bgColor: "#10a37f",
    soldCount: 18,
    externalUrl: "https://sora.com",
  },
  {
    id: "3",
    name: "VEO3 nâng chính chủ Gói 0 credit",
    category: "ai-analyze",
    description:
      "-Dùng Veo3 ultra gmail chính chủ, dùng Antigravity, Gemini ultra, Lm Book, có 30tb bộ nhớ, Wish. -Dùng Ổn định hàng tháng, thích hợp cho dùng lâu dài.",
    tags: ["Tạo ảnh chất lượng cao", "Tạo video chất lượng cao", "Phân tích chuyên nghiệp"],
    originalPrice: 3000000,
    salePrice: 400000,
    discount: 87,
    icon: "V",
    bgColor: "#4285F4",
    soldCount: 16,
    externalUrl: "https://labs.google",
  },
  {
    id: "4",
    name: "VEO3 nâng chính chủ Gói 6k credit",
    category: "ai-analyze",
    description:
      "Dùng full tính năng trên. mỗi tháng có 6k credit dùng Veo3 ultra. Dùng Flow Veo3 ultra model Model 3.1 Lower. k tốn credit",
    tags: ["Tạo ảnh chất lượng cao", "Tạo video chất lượng cao", "Phân tích chuyên nghiệp"],
    originalPrice: 3000000,
    salePrice: 500000,
    discount: 83,
    icon: "V",
    bgColor: "#4285F4",
    soldCount: 9,
    externalUrl: "https://labs.google",
  },
  {
    id: "5",
    name: "Gemini PRO 2TB Cloud Storage",
    category: "ai-analyze",
    description:
      "Tài khoản Gemini Pro chính chủ với 2TB lưu trữ Google Drive. Truy cập Gemini Advanced, tích hợp toàn bộ hệ sinh thái Google Workspace.",
    tags: ["Gemini Advanced", "2TB Google Drive", "Google Workspace"],
    originalPrice: 800000,
    salePrice: 220000,
    discount: 73,
    icon: "G",
    bgColor: "#4285F4",
    soldCount: 31,
    externalUrl: "https://gemini.google.com",
  },
  {
    id: "6",
    name: "Luma Dream Machine Pro",
    category: "video",
    description:
      "Tạo video AI chất lượng cao từ text và hình ảnh. Hỗ trợ camera movement, style control và xuất video 4K. Phù hợp cho content creator chuyên nghiệp.",
    tags: ["Tạo video từ text", "Camera AI", "Xuất 4K"],
    originalPrice: 1200000,
    salePrice: 350000,
    discount: 71,
    icon: "L",
    bgColor: "#6C47FF",
    soldCount: 12,
    externalUrl: "https://lumalabs.ai",
  },
  {
    id: "7",
    name: "Midjourney Pro - Unlimited",
    category: "image-video",
    description:
      "Tạo hình ảnh AI đẹp xuất sắc với Midjourney Pro. Unlimited fast images, private mode, stealth mode và commercial usage license.",
    tags: ["Unlimited hình ảnh", "Private mode", "Commercial License"],
    originalPrice: 1500000,
    salePrice: 450000,
    discount: 70,
    hot: true,
    icon: "M",
    bgColor: "#000000",
    soldCount: 45,
    externalUrl: "https://midjourney.com",
  },
  {
    id: "8",
    name: "Claude AI Pro - Opus 4",
    category: "ai-chat",
    description:
      "Claude Pro với model Opus 4 mạnh nhất. Phân tích văn bản dài, lập trình, nghiên cứu và sáng tạo nội dung với context window 200K tokens.",
    tags: ["Claude Opus 4", "200K context", "Lập trình nâng cao"],
    originalPrice: 900000,
    salePrice: 280000,
    discount: 69,
    icon: "C",
    bgColor: "#CC785C",
    soldCount: 22,
    externalUrl: "https://claude.ai",
  },
  {
    id: "9",
    name: "Runway ML Gen-3 Alpha",
    category: "edit-video",
    description:
      "Chỉnh sửa video với AI tiên tiến nhất. Xóa background, thêm hiệu ứng, kéo dài video và tạo video từ ảnh với chất lượng điện ảnh.",
    tags: ["Video Inpainting", "Motion Brush", "Gen-3 Alpha Turbo"],
    originalPrice: 1100000,
    salePrice: 380000,
    discount: 65,
    icon: "R",
    bgColor: "#FF4D4D",
    soldCount: 8,
    externalUrl: "https://runwayml.com",
  },
  {
    id: "10",
    name: "ElevenLabs Creator - Clone Voice",
    category: "ai-chatbot",
    description:
      "Tạo giọng nói AI cực kỳ tự nhiên. Clone giọng nói của bạn, tạo audiobook, podcast và lồng tiếng chuyên nghiệp bằng AI.",
    tags: ["Clone giọng nói", "29 ngôn ngữ", "Commercial License"],
    originalPrice: 700000,
    salePrice: 230000,
    discount: 67,
    icon: "E",
    bgColor: "#FF6B35",
    soldCount: 19,
    externalUrl: "https://elevenlabs.io",
  },
  {
    id: "11",
    name: "Perplexity Pro - AI Search",
    category: "ai-chat",
    description:
      "Tìm kiếm AI thế hệ mới với nguồn trích dẫn rõ ràng. Trả lời câu hỏi phức tạp, nghiên cứu chuyên sâu và phân tích dữ liệu real-time.",
    tags: ["AI Search Pro", "Real-time data", "File upload"],
    originalPrice: 600000,
    salePrice: 180000,
    discount: 70,
    icon: "P",
    bgColor: "#20B2AA",
    soldCount: 14,
    externalUrl: "https://perplexity.ai",
  },
  {
    id: "12",
    name: "Adobe Firefly Premium",
    category: "image-video",
    description:
      "Tạo và chỉnh sửa hình ảnh với Adobe Firefly. Tích hợp vào Photoshop, Illustrator với Generative Fill, Text to Image và nhiều tính năng sáng tạo.",
    tags: ["Generative Fill", "Text to Image", "Adobe Integration"],
    originalPrice: 1300000,
    salePrice: 420000,
    discount: 68,
    hot: true,
    icon: "A",
    bgColor: "#FF0000",
    soldCount: 27,
    externalUrl: "https://firefly.adobe.com",
  },
]

export const websiteServices: WebsiteService[] = [
  {
    id: "ws-1",
    name: "Landing Page Chuyên Nghiệp",
    description:
      "Thiết kế landing page hiện đại, tối ưu chuyển đổi. Phù hợp cho sản phẩm, dịch vụ và chiến dịch marketing.",
    features: [
      "Thiết kế responsive đa thiết bị",
      "Tối ưu SEO cơ bản",
      "Form liên hệ & tích hợp email",
      "Tốc độ tải trang nhanh",
      "Bàn giao mã nguồn",
    ],
    price: "2.000.000đ",
    badge: "Phổ biến",
    icon: "🌐",
    popular: true,
  },
  {
    id: "ws-2",
    name: "Website Bán Hàng E-commerce",
    description:
      "Xây dựng cửa hàng trực tuyến đầy đủ tính năng. Quản lý sản phẩm, giỏ hàng, thanh toán và đơn hàng.",
    features: [
      "Quản lý sản phẩm không giới hạn",
      "Thanh toán VNPay, Momo, COD",
      "Dashboard admin quản lý đơn hàng",
      "Tích hợp kho vận",
      "Hỗ trợ 1 năm miễn phí",
    ],
    price: "8.000.000đ",
    badge: "Hot",
    icon: "🛒",
  },
  {
    id: "ws-3",
    name: "Website Doanh Nghiệp",
    description:
      "Website chuyên nghiệp cho doanh nghiệp. Đầy đủ trang giới thiệu, dịch vụ, blog và tích hợp CRM.",
    features: [
      "Thiết kế theo thương hiệu",
      "CMS quản lý nội dung",
      "Blog & tin tức",
      "Tích hợp Google Analytics",
      "SSL & bảo mật nâng cao",
    ],
    price: "5.000.000đ",
    icon: "🏢",
  },
  {
    id: "ws-4",
    name: "Web App / Dashboard",
    description:
      "Xây dựng ứng dụng web phức tạp. Dashboard quản trị, SaaS, hệ thống quản lý nội bộ theo yêu cầu.",
    features: [
      "Thiết kế UI/UX tùy chỉnh",
      "Tích hợp API & Database",
      "Authentication & phân quyền",
      "Realtime notifications",
      "Triển khai production",
    ],
    price: "Liên hệ",
    icon: "⚙️",
  },
  {
    id: "ws-5",
    name: "Portfolio / CV Online",
    description:
      "Trang portfolio cá nhân ấn tượng cho freelancer, designer, developer. Thể hiện kỹ năng và dự án của bạn.",
    features: [
      "Thiết kế sáng tạo độc đáo",
      "Showcase dự án & kỹ năng",
      "Responsive trên mọi thiết bị",
      "Animated & interactive",
      "Custom domain",
    ],
    price: "1.500.000đ",
    badge: "Mới",
    icon: "👤",
  },
  {
    id: "ws-6",
    name: "Website AI Tích Hợp Chatbot",
    description:
      "Website tích hợp chatbot AI thông minh. Hỗ trợ khách hàng 24/7, tư vấn tự động và thu thập lead.",
    features: [
      "Chatbot AI tùy chỉnh theo nghiệp",
      "Tích hợp GPT-4 hoặc Claude",
      "Dashboard phân tích hội thoại",
      "Đồng bộ CRM",
      "Training bot theo dữ liệu riêng",
    ],
    price: "12.000.000đ",
    badge: "AI",
    icon: "🤖",
  },
]

export const courses: Course[] = [
  {
    id: "c-1",
    name: "Làm chủ AI Video với VEO3 & Sora",
    description:
      "Học cách tạo video AI chuyên nghiệp từ đầu. Bao gồm prompt engineering, style control và xuất bản nội dung.",
    lessons: 42,
    duration: "18 giờ",
    level: "Cơ bản",
    price: 499000,
    originalPrice: 1200000,
    icon: "🎬",
    tags: ["VEO3", "Sora2", "Video AI"],
    rating: 4.9,
    students: 1250,
    bestseller: true,
  },
  {
    id: "c-2",
    name: "Midjourney & Stable Diffusion Pro",
    description:
      "Tạo hình ảnh AI đẹp xuất sắc. Học Midjourney v6, Stable Diffusion, ControlNet và các kỹ thuật nâng cao.",
    lessons: 56,
    duration: "24 giờ",
    level: "Trung cấp",
    price: 699000,
    originalPrice: 1800000,
    icon: "🎨",
    tags: ["Midjourney", "Stable Diffusion", "AI Art"],
    rating: 4.8,
    students: 980,
    bestseller: true,
  },
  {
    id: "c-3",
    name: "ChatGPT & Claude Nâng Cao",
    description:
      "Khai thác tối đa sức mạnh của ChatGPT và Claude. Prompt engineering, automation workflow và ứng dụng kinh doanh.",
    lessons: 35,
    duration: "15 giờ",
    level: "Cơ bản",
    price: 399000,
    originalPrice: 900000,
    icon: "🤖",
    tags: ["ChatGPT", "Claude", "Prompt Engineering"],
    rating: 4.7,
    students: 2100,
    new: true,
  },
  {
    id: "c-4",
    name: "AI Marketing & Content Creation",
    description:
      "Ứng dụng AI vào marketing. Tạo copy, hình ảnh, video quảng cáo và chiến lược content bằng AI.",
    lessons: 48,
    duration: "20 giờ",
    level: "Trung cấp",
    price: 599000,
    originalPrice: 1500000,
    icon: "📱",
    tags: ["AI Marketing", "Content AI", "Social Media"],
    rating: 4.8,
    students: 756,
  },
  {
    id: "c-5",
    name: "Lập Trình Web với AI Copilot",
    description:
      "Học lập trình hiệu quả với GitHub Copilot, Cursor AI và Claude. Tăng tốc độ code gấp 5 lần với AI.",
    lessons: 62,
    duration: "28 giờ",
    level: "Nâng cao",
    price: 899000,
    originalPrice: 2200000,
    icon: "💻",
    tags: ["Cursor AI", "GitHub Copilot", "Web Dev"],
    rating: 4.9,
    students: 543,
    new: true,
  },
  {
    id: "c-6",
    name: "Kiếm Tiền Với AI Tools",
    description:
      "Hướng dẫn xây dựng nguồn thu nhập thụ động với AI. Freelance AI, bán prompt, tạo sản phẩm số và automation.",
    lessons: 38,
    duration: "16 giờ",
    level: "Cơ bản",
    price: 449000,
    originalPrice: 1100000,
    icon: "💰",
    tags: ["Kiếm tiền online", "AI Business", "Freelance"],
    rating: 4.6,
    students: 1890,
    bestseller: true,
  },
]
