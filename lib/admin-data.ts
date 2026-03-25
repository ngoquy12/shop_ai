// ─── Admin Mock Data & Types ───────────────────────────────────────────────

export type AdminProduct = {
  id: string; name: string; category: string; description: string; tags: string[]
  originalPrice: number; salePrice: number; discount: number; hot: boolean
  icon: string; bgColor: string; soldCount: number; externalUrl: string
  status: "active" | "inactive"; createdAt: string
}

export type AdminOrder = {
  id: string; date: string
  customer: { name: string; email: string; initials: string; color: string }
  items: { name: string; type: "tool" | "course"; price: number; icon: string }[]
  total: number; paymentMethod: string; status: "pending" | "processing" | "completed" | "cancelled"
}

export type AdminCourse = {
  id: string; title: string; subtitle: string
  instructor: { name: string; avatar: string }
  level: "Cơ bản" | "Trung cấp" | "Nâng cao"
  price: number; originalPrice: number; lessons: number; duration: string
  students: number; rating: number; badge: "New" | "Bestseller" | null
  status: "active" | "inactive"; thumbnail: string; slug: string
  tags: string[]; createdAt: string
}

export type AdminCustomer = {
  id: string; name: string; email: string; initials: string; color: string
  plan: "Free" | "Pro"; joinedAt: string; totalSpent: number
  orderCount: number; status: "active" | "inactive"; lastLogin: string
}

export type RevenuePoint = { date: string; revenue: number; orders: number }

// ─── Dashboard Stats ───────────────────────────────────────────────────────
export const ADMIN_STATS = {
  revenue: { value: 48500000, change: +12.5, label: "Doanh thu tháng", icon: "💰" },
  orders: { value: 342, change: +8.3, label: "Đơn hàng tháng", icon: "🛒" },
  customers: { value: 7240, change: +15.2, label: "Khách hàng", icon: "👥" },
  products: { value: 12, change: 0, label: "Sản phẩm đang bán", icon: "📦" },
}

// ─── Revenue Chart (30 days, seeded) ──────────────────────────────────────
const SEED = [42,38,55,48,62,71,58,45,52,68,74,81,69,55,48,63,77,85,72,66,58,71,83,91,78,65,70,88,95,102]
export const REVENUE_DATA: RevenuePoint[] = SEED.map((factor, i) => {
  const d = new Date("2026-03-25")
  d.setDate(d.getDate() - (29 - i))
  return {
    date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
    revenue: factor * 110000,
    orders: Math.round(factor / 8),
  }
})

// ─── Products ──────────────────────────────────────────────────────────────
export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id:"1", name:"Picsart 2500 điểm Workspace AI", category:"video", status:"active", hot:true, icon:"P", bgColor:"#E91E8C", description:"Tổng hợp VEO3, Sora2, Grok. Tài khoản chia sẻ.", tags:["Tạo ảnh","Tạo video","ChatGPT5"], originalPrice:300000, salePrice:250000, discount:17, soldCount:24, externalUrl:"https://picsart.com", createdAt:"2026-01-15" },
  { id:"2", name:"Sora2 và ChatGPT Plus", category:"video", status:"active", hot:true, icon:"S", bgColor:"#10a37f", description:"Tài khoản Sora2 chính chủ + ChatGPT Plus.", tags:["Sora2","ChatGPT Plus","Unlimited"], originalPrice:500000, salePrice:350000, discount:30, soldCount:18, externalUrl:"https://sora.com", createdAt:"2026-01-20" },
  { id:"3", name:"VEO3 nâng chính chủ Gói 0 credit", category:"ai-analyze", status:"active", hot:false, icon:"V", bgColor:"#4285F4", description:"Veo3 ultra gmail chính chủ, 30TB bộ nhớ.", tags:["VEO3","Gemini Ultra","30TB"], originalPrice:3000000, salePrice:400000, discount:87, soldCount:16, externalUrl:"https://labs.google", createdAt:"2026-02-01" },
  { id:"4", name:"VEO3 nâng chính chủ Gói 6k credit", category:"ai-analyze", status:"active", hot:false, icon:"V", bgColor:"#4285F4", description:"Full tính năng + 6k credit/tháng Veo3 ultra.", tags:["VEO3","6k credit","Flow"], originalPrice:3000000, salePrice:500000, discount:83, soldCount:9, externalUrl:"https://labs.google", createdAt:"2026-02-05" },
  { id:"5", name:"Gemini PRO 2TB Cloud Storage", category:"ai-analyze", status:"active", hot:false, icon:"G", bgColor:"#4285F4", description:"Gemini Pro chính chủ + 2TB Google Drive.", tags:["Gemini Advanced","2TB Drive","Workspace"], originalPrice:800000, salePrice:220000, discount:73, soldCount:31, externalUrl:"https://gemini.google.com", createdAt:"2026-02-10" },
  { id:"6", name:"Luma Dream Machine Pro", category:"video", status:"active", hot:false, icon:"L", bgColor:"#6C47FF", description:"Video AI chất lượng cao, hỗ trợ 4K.", tags:["Tạo video","Camera AI","4K"], originalPrice:1200000, salePrice:350000, discount:71, soldCount:12, externalUrl:"https://lumalabs.ai", createdAt:"2026-02-15" },
  { id:"7", name:"Midjourney Pro - Unlimited", category:"image-video", status:"active", hot:true, icon:"M", bgColor:"#1a1a2e", description:"Unlimited fast images, private mode, commercial license.", tags:["Unlimited","Private mode","Commercial"], originalPrice:1500000, salePrice:450000, discount:70, soldCount:45, externalUrl:"https://midjourney.com", createdAt:"2026-01-10" },
  { id:"8", name:"Claude AI Pro - Opus 4", category:"ai-chat", status:"active", hot:false, icon:"C", bgColor:"#CC785C", description:"Claude Pro với Opus 4, context 200K tokens.", tags:["Claude Opus 4","200K context","Coding"], originalPrice:900000, salePrice:280000, discount:69, soldCount:22, externalUrl:"https://claude.ai", createdAt:"2026-01-25" },
  { id:"9", name:"Runway ML Gen-3 Alpha", category:"edit-video", status:"inactive", hot:false, icon:"R", bgColor:"#FF4D4D", description:"Chỉnh sửa video AI, xóa background.", tags:["Video Inpainting","Motion Brush","Gen-3"], originalPrice:1100000, salePrice:380000, discount:65, soldCount:8, externalUrl:"https://runwayml.com", createdAt:"2026-02-20" },
  { id:"10", name:"ElevenLabs Creator - Clone Voice", category:"ai-chatbot", status:"active", hot:false, icon:"E", bgColor:"#FF6B35", description:"Tạo giọng AI tự nhiên, clone giọng.", tags:["Clone voice","29 ngôn ngữ","Commercial"], originalPrice:700000, salePrice:230000, discount:67, soldCount:19, externalUrl:"https://elevenlabs.io", createdAt:"2026-02-25" },
  { id:"11", name:"Perplexity Pro - AI Search", category:"ai-chat", status:"active", hot:false, icon:"P", bgColor:"#20B2AA", description:"Tìm kiếm AI real-time với nguồn trích dẫn.", tags:["AI Search","Real-time","File upload"], originalPrice:600000, salePrice:180000, discount:70, soldCount:14, externalUrl:"https://perplexity.ai", createdAt:"2026-03-01" },
  { id:"12", name:"Adobe Firefly Premium", category:"image-video", status:"active", hot:true, icon:"A", bgColor:"#FF0000", description:"Tạo ảnh Generative Fill, tích hợp Photoshop.", tags:["Generative Fill","Text to Image","Adobe"], originalPrice:1300000, salePrice:420000, discount:68, soldCount:27, externalUrl:"https://firefly.adobe.com", createdAt:"2026-03-05" },
]

// ─── Recent Orders ─────────────────────────────────────────────────────────
export const ADMIN_ORDERS: AdminOrder[] = [
  { id:"VP-2026-001", date:"2026-03-25T08:30:00", status:"pending", customer:{ name:"Trần Minh Khoa", email:"tmkhoa@gmail.com", initials:"TK", color:"from-blue-500 to-cyan-500" }, items:[{ name:"Midjourney Pro", type:"tool", price:450000, icon:"🎨" }], total:450000, paymentMethod:"VietQR" },
  { id:"VP-2026-002", date:"2026-03-25T07:15:00", status:"processing", customer:{ name:"Nguyễn Thị Lan", email:"ntlan@gmail.com", initials:"NL", color:"from-violet-500 to-pink-500" }, items:[{ name:"AI Thực Chiến", type:"course", price:990000, icon:"📚" },{ name:"ChatGPT Plus", type:"tool", price:350000, icon:"🤖" }], total:1340000, paymentMethod:"MoMo" },
  { id:"VP-2026-003", date:"2026-03-24T22:00:00", status:"completed", customer:{ name:"Phạm Văn Đức", email:"pvduc@gmail.com", initials:"PD", color:"from-green-500 to-emerald-500" }, items:[{ name:"VEO3 Gói 6k credit", type:"tool", price:500000, icon:"🎬" }], total:500000, paymentMethod:"ZaloPay" },
  { id:"VP-2026-004", date:"2026-03-24T18:45:00", status:"completed", customer:{ name:"Lê Thị Hương", email:"lhuong@gmail.com", initials:"LH", color:"from-orange-500 to-red-500" }, items:[{ name:"Gemini PRO 2TB", type:"tool", price:220000, icon:"✨" }], total:220000, paymentMethod:"VietQR" },
  { id:"VP-2026-005", date:"2026-03-24T15:30:00", status:"cancelled", customer:{ name:"Hoàng Quốc Bảo", email:"hqbao@gmail.com", initials:"HB", color:"from-pink-500 to-rose-500" }, items:[{ name:"Claude Pro Opus 4", type:"tool", price:280000, icon:"🧠" },{ name:"ElevenLabs Creator", type:"tool", price:230000, icon:"🎙️" }], total:510000, paymentMethod:"MoMo" },
  { id:"VP-2026-006", date:"2026-03-24T10:20:00", status:"completed", customer:{ name:"Vũ Thị Mai", email:"vtmai@gmail.com", initials:"VM", color:"from-teal-500 to-cyan-500" }, items:[{ name:"AI Marketing", type:"course", price:599000, icon:"📱" }], total:599000, paymentMethod:"VietQR" },
  { id:"VP-2026-007", date:"2026-03-23T20:10:00", status:"processing", customer:{ name:"Đinh Công Minh", email:"dcminh@gmail.com", initials:"DM", color:"from-indigo-500 to-blue-500" }, items:[{ name:"Lập Trình Web AI", type:"course", price:899000, icon:"💻" }], total:899000, paymentMethod:"ZaloPay" },
  { id:"VP-2026-008", date:"2026-03-23T14:55:00", status:"completed", customer:{ name:"Bùi Thị Ngọc", email:"btngoc@gmail.com", initials:"BN", color:"from-purple-500 to-violet-500" }, items:[{ name:"Picsart 2500", type:"tool", price:250000, icon:"🖼️" },{ name:"Perplexity Pro", type:"tool", price:180000, icon:"🔍" }], total:430000, paymentMethod:"MoMo" },
]

// ─── Top Products ──────────────────────────────────────────────────────────
export const TOP_PRODUCTS = [
  { name: "Midjourney Pro - Unlimited", revenue: 20250000, sold: 45, icon: "🎨", color: "bg-violet-500" },
  { name: "Adobe Firefly Premium", revenue: 11340000, sold: 27, icon: "🔥", color: "bg-red-500" },
  { name: "Gemini PRO 2TB", revenue: 6820000, sold: 31, icon: "✨", color: "bg-blue-500" },
  { name: "ElevenLabs Creator", revenue: 4370000, sold: 19, icon: "🎙️", color: "bg-orange-500" },
  { name: "Claude AI Pro", revenue: 6160000, sold: 22, icon: "🧠", color: "bg-amber-500" },
]

// ─── Courses ───────────────────────────────────────────────────────────────
export const ADMIN_COURSES: AdminCourse[] = [
  { id:"c1", title:"AI Thực Chiến: ChatGPT, Midjourney & Automation", subtitle:"Làm chủ AI từ cơ bản đến ứng dụng thực tế trong công việc hàng ngày", instructor:{ name:"Nguyễn Minh Tuấn", avatar:"NT" }, level:"Trung cấp", price:990000, originalPrice:1990000, lessons:48, duration:"12h 30m", students:1284, rating:4.9, badge:"Bestseller", status:"active", thumbnail:"🚀", slug:"ai-thuc-chien", tags:["ChatGPT","Midjourney","Automation","AI Tools"], createdAt:"2026-01-10" },
  { id:"c2", title:"Lập Trình Web Với AI: Từ Ý Tưởng Đến Sản Phẩm", subtitle:"Xây dựng web app chuyên nghiệp với sự hỗ trợ của AI Copilot", instructor:{ name:"Phạm Thanh Hải", avatar:"PH" }, level:"Nâng cao", price:890000, originalPrice:1500000, lessons:62, duration:"18h 45m", students:892, rating:4.8, badge:"New", status:"active", thumbnail:"💻", slug:"lap-trinh-web-ai", tags:["Next.js","AI Copilot","GitHub Copilot","TypeScript"], createdAt:"2026-02-15" },
  { id:"c3", title:"AI Marketing & Content Creation", subtitle:"Tạo content viral, chạy quảng cáo hiệu quả với AI", instructor:{ name:"Trần Thị Linh", avatar:"TL" }, level:"Cơ bản", price:599000, originalPrice:990000, lessons:35, duration:"8h 20m", students:2156, rating:4.7, badge:"Bestseller", status:"active", thumbnail:"📱", slug:"ai-marketing", tags:["Marketing","Content AI","Facebook Ads","ChatGPT"], createdAt:"2026-01-20" },
  { id:"c4", title:"Thiết Kế Hình Ảnh AI: From Zero to Hero", subtitle:"Midjourney, Firefly, Stable Diffusion — tất cả trong một khóa học", instructor:{ name:"Lê Hoàng Nam", avatar:"LN" }, level:"Cơ bản", price:490000, originalPrice:790000, lessons:28, duration:"6h 50m", students:3422, rating:4.8, badge:"Bestseller", status:"active", thumbnail:"🎨", slug:"thiet-ke-ai", tags:["Midjourney","Adobe Firefly","Stable Diffusion","Prompt"], createdAt:"2025-12-10" },
  { id:"c5", title:"VEO3 Mastery: Tạo Video AI Chuyên Nghiệp", subtitle:"Làm video cinematic chất lượng cao với VEO3 và các công cụ AI video", instructor:{ name:"Nguyễn Minh Tuấn", avatar:"NT" }, level:"Trung cấp", price:990000, originalPrice:1490000, lessons:40, duration:"10h 15m", students:654, rating:4.9, badge:"New", status:"active", thumbnail:"🎬", slug:"veo3-mastery", tags:["VEO3","Video AI","Sora","Runway"], createdAt:"2026-03-01" },
  { id:"c6", title:"Prompt Engineering Masterclass", subtitle:"Viết prompt như chuyên gia, tối ưu kết quả AI trong mọi tình huống", instructor:{ name:"Đỗ Quang Thành", avatar:"DT" }, level:"Cơ bản", price:390000, originalPrice:590000, lessons:22, duration:"4h 30m", students:4891, rating:4.6, badge:"Bestseller", status:"active", thumbnail:"✍️", slug:"prompt-engineering", tags:["Prompt","ChatGPT","Claude","Gemini"], createdAt:"2025-11-15" },
  { id:"c7", title:"Build SaaS Apps With AI: Full Stack", subtitle:"Xây dựng SaaS thực tế — từ ý tưởng đến kiếm tiền", instructor:{ name:"Phạm Thanh Hải", avatar:"PH" }, level:"Nâng cao", price:1490000, originalPrice:2490000, lessons:85, duration:"28h 00m", students:421, rating:4.8, badge:"New", status:"active", thumbnail:"⚡", slug:"build-saas-ai", tags:["SaaS","Next.js","Supabase","Stripe","AI"], createdAt:"2026-03-10" },
  { id:"c8", title:"AI Business Analytics & Báo Cáo Tự Động", subtitle:"Dùng AI phân tích dữ liệu kinh doanh và tạo báo cáo tự động", instructor:{ name:"Trần Thị Linh", avatar:"TL" }, level:"Trung cấp", price:790000, originalPrice:1190000, lessons:31, duration:"7h 40m", students:567, rating:4.5, badge:null, status:"inactive", thumbnail:"📊", slug:"ai-business-analytics", tags:["Data Analysis","Power BI","Python","AI Reports"], createdAt:"2026-02-28" },
]

// ─── Customers ─────────────────────────────────────────────────────────────
export const ADMIN_CUSTOMERS: AdminCustomer[] = [
  { id:"u1", name:"Nguyễn Văn An", email:"nguyenvanan@gmail.com", initials:"NA", color:"from-blue-500 to-cyan-500", plan:"Pro", joinedAt:"2025-10-15", totalSpent:4870000, orderCount:8, status:"active", lastLogin:"2026-03-25T08:30:00" },
  { id:"u2", name:"Trần Minh Khoa", email:"tmkhoa@gmail.com", initials:"TK", color:"from-blue-500 to-cyan-500", plan:"Pro", joinedAt:"2025-11-02", totalSpent:3250000, orderCount:5, status:"active", lastLogin:"2026-03-25T08:30:00" },
  { id:"u3", name:"Nguyễn Thị Lan", email:"ntlan@gmail.com", initials:"NL", color:"from-violet-500 to-pink-500", plan:"Pro", joinedAt:"2025-12-18", totalSpent:2890000, orderCount:6, status:"active", lastLogin:"2026-03-25T07:15:00" },
  { id:"u4", name:"Phạm Văn Đức", email:"pvduc@gmail.com", initials:"PD", color:"from-green-500 to-emerald-500", plan:"Free", joinedAt:"2026-01-05", totalSpent:500000, orderCount:1, status:"active", lastLogin:"2026-03-24T22:00:00" },
  { id:"u5", name:"Lê Thị Hương", email:"lhuong@gmail.com", initials:"LH", color:"from-orange-500 to-red-500", plan:"Pro", joinedAt:"2026-01-12", totalSpent:1980000, orderCount:4, status:"active", lastLogin:"2026-03-24T18:45:00" },
  { id:"u6", name:"Hoàng Quốc Bảo", email:"hqbao@gmail.com", initials:"HB", color:"from-pink-500 to-rose-500", plan:"Free", joinedAt:"2026-02-01", totalSpent:510000, orderCount:2, status:"inactive", lastLogin:"2026-03-20T10:00:00" },
  { id:"u7", name:"Vũ Thị Mai", email:"vtmai@gmail.com", initials:"VM", color:"from-teal-500 to-cyan-500", plan:"Pro", joinedAt:"2026-01-28", totalSpent:2150000, orderCount:3, status:"active", lastLogin:"2026-03-24T10:20:00" },
  { id:"u8", name:"Đinh Công Minh", email:"dcminh@gmail.com", initials:"DM", color:"from-indigo-500 to-blue-500", plan:"Free", joinedAt:"2026-02-14", totalSpent:899000, orderCount:1, status:"active", lastLogin:"2026-03-23T20:10:00" },
  { id:"u9", name:"Bùi Thị Ngọc", email:"btngoc@gmail.com", initials:"BN", color:"from-purple-500 to-violet-500", plan:"Pro", joinedAt:"2025-09-30", totalSpent:5640000, orderCount:11, status:"active", lastLogin:"2026-03-23T14:55:00" },
  { id:"u10", name:"Lý Văn Phúc", email:"lvphuc@gmail.com", initials:"LP", color:"from-amber-500 to-orange-500", plan:"Free", joinedAt:"2026-03-01", totalSpent:0, orderCount:0, status:"active", lastLogin:"2026-03-22T09:00:00" },
]

// ─── Analytics: Category Revenue ───────────────────────────────────────────
export const CATEGORY_REVENUE = [
  { label: "Video AI", revenue: 18400000, color: "bg-violet-500", pct: 38 },
  { label: "Hình ảnh AI", revenue: 14200000, color: "bg-blue-500", pct: 29 },
  { label: "AI Chat", revenue: 8600000, color: "bg-green-500", pct: 18 },
  { label: "Khóa học", revenue: 5300000, color: "bg-orange-500", pct: 11 },
  { label: "Khác", revenue: 2000000, color: "bg-pink-500", pct: 4 },
]

// ─── Prompts ───────────────────────────────────────────────────────────────
export type AdminPrompt = {
  id: string; title: string; category: string; content: string; tags: string[]
  isPremium: boolean; isFeatured: boolean
  views: number; copies: number
  status: "active" | "inactive"; createdAt: string
}

export const PROMPT_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "video", label: "Tạo Video" },
  { id: "image", label: "Hình Ảnh" },
  { id: "marketing", label: "Marketing" },
  { id: "coding", label: "Lập Trình" },
  { id: "writing", label: "Viết Lách" },
  { id: "business", label: "Kinh Doanh" },
  { id: "seo", label: "SEO" },
]

export const ADMIN_PROMPTS: AdminPrompt[] = [
  { id:"p1", title:"Tạo video viral TikTok từ sản phẩm", category:"video", content:"Bạn là chuyên gia TikTok. Viết script video 60 giây cho [SẢN PHẨM]. Cần: Hook 3 giây đầu, điểm đau khách hàng, giải pháp, social proof, CTA. Tone: Năng động.", tags:["TikTok","Script","Viral"], isPremium:false, isFeatured:true, views:15420, copies:3280, status:"active", createdAt:"2026-01-15" },
  { id:"p2", title:"Midjourney prompt nhân vật anime ultra HD", category:"image", content:"[NAME], beautiful anime character, [HAIR_COLOR] hair, [EYE_COLOR] eyes, wearing [OUTFIT], standing in [SETTING], dramatic lighting, 8K --ar 2:3 --v 6.1 --style raw --q 2", tags:["Midjourney","Anime","Ultra HD"], isPremium:true, isFeatured:true, views:28900, copies:8450, status:"active", createdAt:"2026-01-20" },
  { id:"p3", title:"Facebook Ads copy chuyển đổi cao", category:"marketing", content:"Viết 3 phiên bản quảng cáo Facebook cho [SẢN PHẨM] nhắm [KHÁCH HÀNG]. Mỗi phiên bản: Hook <25 chữ, Body 100-150 chữ đánh điểm đau, Social proof, CTA urgency.", tags:["Facebook Ads","Copywriting","Conversion"], isPremium:false, isFeatured:true, views:19870, copies:5120, status:"active", createdAt:"2026-02-01" },
  { id:"p4", title:"Debug code và giải thích lỗi chi tiết", category:"coding", content:"Bạn là senior dev 10+ năm. Code lỗi:\n```\n[CODE ĐÂY]\n```\nLỗi: [MÔ TẢ]\nHãy: 1) Nguyên nhân, 2) Giải thích kỹ thuật, 3) Code đã sửa, 4) Cách phòng tránh.", tags:["Debug","Code Review","Programming"], isPremium:false, isFeatured:false, views:12340, copies:4210, status:"active", createdAt:"2026-01-10" },
  { id:"p5", title:"Cold email B2B tỷ lệ mở cao", category:"writing", content:"Viết cold email cho [CÔNG TY], gửi [CHỨC VỤ] ngành [NGÀNH]. Sản phẩm: [MÔ TẢ]. Email: Subject <50 ký tự, mở đầu cá nhân hóa, giá trị 2 câu, social proof, CTA thấp ma sát. Dưới 150 chữ.", tags:["Email Marketing","B2B","Cold Email"], isPremium:true, isFeatured:false, views:8760, copies:2140, status:"active", createdAt:"2026-02-10" },
  { id:"p6", title:"Phân tích đối thủ cạnh tranh toàn diện", category:"business", content:"Phân tích đối thủ [TÊN] trong [NGÀNH]: 1) Mô hình kinh doanh, 2) SWOT, 3) Chiến lược marketing, 4) Pricing, 5) Target audience, 6) Cơ hội differentiate, 7) Rủi ro.", tags:["Phân tích","SWOT","Chiến lược"], isPremium:true, isFeatured:true, views:6540, copies:1890, status:"active", createdAt:"2026-02-15" },
  { id:"p7", title:"Tối ưu SEO On-Page cho bài blog", category:"seo", content:"Tối ưu SEO cho bài về [CHỦ ĐỀ], keyword: [KEYWORD]. Cung cấp: Title 55-60 ký tự, Meta desc 150-160 ký tự, H1 + structure, 5-7 LSI keyword, Internal links, Schema, Alt text.", tags:["SEO","On-Page","Content"], isPremium:false, isFeatured:false, views:11230, copies:3670, status:"active", createdAt:"2026-02-20" },
  { id:"p8", title:"Landing page copy full-stack", category:"marketing", content:"Viết copy landing page [SẢN PHẨM] cho [ICP]: Hero (headline+sub+CTA), Pain 3 điểm, Solution, 6 Features, Social proof template, FAQ 5 câu, Final CTA urgency.", tags:["Landing Page","Copywriting","Sales"], isPremium:true, isFeatured:true, views:22180, copies:6340, status:"active", createdAt:"2026-03-01" },
  { id:"p9", title:"VEO3 prompt tạo video cinematic", category:"video", content:"A [SCENE] in [LOCATION]. Camera: [SHOT_TYPE] slowly [MOVEMENT], [LIGHTING] creates [MOOD]. [SUBJECT] [ACTION]. Color: [PALETTE] tones, 2.39:1. Sound: [AMBIENT], [MUSIC]. 4K 24fps IMAX. 8 seconds.", tags:["VEO3","Cinematic","Text-to-Video"], isPremium:true, isFeatured:true, views:31200, copies:9870, status:"active", createdAt:"2026-03-05" },
  { id:"p10", title:"Content strategy 30 ngày social media", category:"marketing", content:"Kế hoạch content 30 ngày cho [THƯƠNG HIỆU] trên [KÊNH]. Mục tiêu: [MỤC TIÊU]. Cung cấp: Content pillars, lịch 4 tuần, 10 ý tưởng post, hashtag strategy, thời điểm đăng tối ưu, KPIs.", tags:["Content Strategy","Social Media","30-Day"], isPremium:false, isFeatured:false, views:14560, copies:4320, status:"active", createdAt:"2026-03-10" },
  { id:"p11", title:"Ảnh sản phẩm thương mại Midjourney", category:"image", content:"[PRODUCT] product photography, [DESCRIPTION], on [SURFACE], [PROPS] arranged, [LIGHTING], [BACKGROUND], commercial style, 85mm f/2.8, shallow DOF, color-graded --ar 1:1 --v 6.1 --style raw --q 2 --no people watermark", tags:["Midjourney","Product Photo","E-commerce"], isPremium:false, isFeatured:false, views:17890, copies:5540, status:"active", createdAt:"2026-03-12" },
  { id:"p12", title:"Nghiên cứu keyword SEO và opportunity map", category:"seo", content:"Keyword research về [CHỦ ĐỀ] trong [NGÀNH]: 1) 20 long-tail phân loại intent, 2) Độ khó + volume, 3) Top 5 opportunity, 4) Topic cluster, 5) Featured snippet, 6) People Also Ask.", tags:["Keyword Research","SEO","SERP"], isPremium:true, isFeatured:false, views:9340, copies:2780, status:"inactive", createdAt:"2026-03-15" },
  { id:"p13", title:"README chuyên nghiệp cho GitHub project", category:"coding", content:"Viết README.md cho [PROJECT] — [MÔ TẢ]. Stack: [TECH]. Bao gồm: Badges, Demo placeholder, Features list, Installation, .env example, Usage với code, API docs, Contributing, License.", tags:["GitHub","Documentation","Open Source"], isPremium:false, isFeatured:false, views:7820, copies:3120, status:"active", createdAt:"2026-03-18" },
  { id:"p14", title:"Phân tích báo cáo tài chính doanh nghiệp", category:"business", content:"Phân tích tài chính [CÔNG TY] giai đoạn [THỜI GIAN]: Revenue growth, Gross/Operating margin, Cash flow, Ratios P/E ROE ROA, So sánh ngành, Red flags, Điểm mạnh, Khuyến nghị.", tags:["Financial Analysis","Business","Đầu tư"], isPremium:true, isFeatured:false, views:5430, copies:1230, status:"active", createdAt:"2026-03-20" },
  { id:"p15", title:"Xây dựng Customer Persona (ICP) chi tiết", category:"business", content:"Xây dựng 3 ICP cho [SẢN PHẨM]. Mỗi persona: Tên/tuổi/nghề/thu nhập, Mục tiêu, Pain points top 3, Jobs-to-be-done, Kênh thông tin, Quyết định mua, Objections, Marketing approach.", tags:["ICP","Customer Persona","Marketing"], isPremium:false, isFeatured:true, views:13670, copies:4890, status:"active", createdAt:"2026-03-22" },
]
