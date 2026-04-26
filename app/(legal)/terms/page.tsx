import { Separator } from "@/components/ui/separator";

export default function TermsOfServicePage() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none pb-12">
      {/* ── Document Header ── */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 uppercase leading-tight">
          Điều Khoản Sử Dụng
        </h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-slate-500">
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
             Phiên bản 2.1.0 
          </div>
          <span className="hidden sm:inline opacity-30">•</span>
          <span>Ban hành vào ngày {currentDate}</span>
        </div>
      </div>

      <Separator className="my-10 bg-slate-200 dark:bg-slate-800" />

      {/* ── Document Lead ── */}
      <section className="bg-accent/10 border-l-4 border-blue-600 p-6 rounded-r-2xl mb-12 text-slate-700 dark:text-slate-300 text-lg leading-relaxed shadow-sm">
         <p className="m-0">
           <strong>Lưu ý quan trọng:</strong> Bằng cách sử dụng Dịch vụ của VideoPrompt, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của thỏa thuận này, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
         </p>
      </section>

      {/* ── Legal Sections ── */}
      <div className="space-y-16">
        
        {/* Section 1 */}
        <section id="muc-1" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">1</div>
             <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight m-0">ĐỊNH NGHĨA VÀ PHẠM VI</h2>
          </div>
          <div className="pl-1 pl-md-14 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">1.1</span> Giải thích thuật ngữ
              </h3>
              <div className="pl-8 space-y-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p><strong>a) &quot;VideoPrompt&quot;</strong>: Được hiểu là nền tảng cung cấp giải pháp, công cụ và tài nguyên AI cho người dùng.</p>
                <p><strong>b) &quot;Dịch vụ&quot;</strong>: Bao gồm quyền truy cập vào các Prompt AI, khóa học, công cụ lập trình và mọi tài nguyên được công bố trên website.</p>
                <p><strong>c) &quot;Người dùng&quot;</strong>: Bất kỳ cá nhân hoặc tổ chức nào đăng ký tài khoản và sử dụng tài nguyên của hệ thống.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">1.2</span> Hiệu lực pháp lý
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Thỏa thuận này có giá trị pháp lý là một hợp đồng điện tử giữa VideoPrompt và Người dùng, bắt đầu ngay khi Người dùng thực hiện hành vi truy cập đầu tiên.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="muc-2" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">2</div>
             <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight m-0"> QUYỀN SỞ HỮU TRÍ TUỆ</h2>
          </div>
          <div className="pl-1 pl-md-14 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">2.1</span> Sở hữu nội dung
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Toàn bộ tài nguyên Prompt, mã nguồn và học liệu đều thuộc quyền sở hữu trí tuệ độc quyền của VideoPrompt. Việc Bạn mua một sản phẩm kỹ thuật số là hành vi mua giấy phép sử dụng, không phải chuyển nhượng quyền sở hữu bản gốc.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">2.2</span> Các hành vi bị nghiêm cấm
              </h3>
              <div className="pl-8 space-y-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Người dùng tuyệt đối không được thực hiện các hành vi sau:</p>
                <ul className="list-none pl-0 space-y-2">
                   <li className="flex gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">a)</span>
                      <span>Bán lại hoặc phân phối lại các Prompt và tài liệu mà không có sự đồng ý bằng văn bản của VideoPrompt.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">b)</span>
                      <span>Sử dụng các công cụ cào dữ liệu tự động (Web Scraping) để sao chép tài nguyên hệ thống.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="font-bold text-blue-600 flex-shrink-0">c)</span>
                      <span>Chia sẻ tài khoản cá nhân cho nhiều người dùng chung để trục lợi chính sách.</span>
                   </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="muc-3" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">3</div>
             <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight m-0">MIỄN TRỪ TRÁCH NHIỆM</h2>
          </div>
          <div className="pl-1 pl-md-14 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">3.1</span> Tính chất của công cụ AI
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Phản hồi từ AI có thể không chính xác hoặc lỗi thời (Ảo giác AI). VideoPrompt không chịu trách nhiệm cho các quyết định kinh doanh hoặc cá nhân được đưa ra dựa trên kết quả hồi đáp của thuật toán bên thứ ba.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">3.2</span> Luật áp dụng và giải quyết tranh chấp
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Mọi tranh chấp phát sinh từ thỏa thuận này sẽ được giải quyết thông qua hòa giải, và nếu không thành, cơ quan tài phán có thẩm quyền tại Thành phố Hồ Chí Minh sẽ là nơi giải quyết cuối cùng.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
