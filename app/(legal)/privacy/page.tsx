import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
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
          Chính Sách Bảo Mật
        </h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-slate-500">
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
             Cập nhật hiệu chỉnh theo Pháp lệnh
          </div>
          <span className="hidden sm:inline opacity-30">•</span>
          <span>Ban hành vào ngày {currentDate}</span>
        </div>
      </div>

      <Separator className="my-10 bg-slate-200 dark:bg-slate-800" />

      {/* ── Document Lead ── */}
      <section className="bg-accent/10 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-12 text-slate-700 dark:text-slate-300 text-lg leading-relaxed shadow-sm">
         <p className="m-0">
           <strong>Quyền riêng tư của bạn là ưu tiên:</strong> Chính sách này quy định tư cách chúng tôi kiểm soát, thu thập, và truy xuất đối với dữ liệu nhận dạng chủ thể của bạn tại hệ thống VideoPrompt.
         </p>
      </section>

      {/* ── Legal Sections ── */}
      <div className="space-y-16">
        
        {/* Section 1 */}
        <section id="muc-1" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">1</div>
             <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight m-0">THÔNG TIN THU THẬP</h2>
          </div>
          <div className="pl-1 pl-md-14 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">1.1</span> Dữ liệu cá nhân trực tiếp
              </h3>
              <div className="pl-8 space-y-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p><strong>a)</strong> Địa chỉ Email xác thực (cung cấp qua Google Auth / Magic Link).</p>
                <p><strong>b)</strong> Thông tin tài khoản: Tên người dùng, Ảnh đại diện liên kết.</p>
                <p><strong>c)</strong> Thông tin thanh toán: Mã giao dịch (Chúng tôi không nắm giữ thông tin thẻ tín dụng cá nhân).</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">1.2</span> Thông tin kỹ thuật tự động
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Bao gồm địa chỉ IP, loại trình duyệt, nhật ký truy cập (Access Logs) phục vụ cho công tác bảo mật và phòng chống tấn công hệ thống.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="muc-2" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">2</div>
             <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight m-0">SỬ DỤNG VÀ CHIA SẺ DỮ LIỆU</h2>
          </div>
          <div className="pl-1 pl-md-14 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">2.1</span> Mục đích sử dụng
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Chúng tôi chỉ sử dụng dữ liệu của Bạn để duy trì quyền truy cập tài nguyên, hỗ trợ kỹ thuật và thông báo các thay đổi quan trọng đến hệ thống.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">2.2</span> Chia sẻ bên thứ ba
              </h3>
              <div className="pl-8 space-y-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>VideoPrompt không mua bán dữ liệu người dùng cho bất kỳ bên thứ ba nào. Dữ liệu chỉ được chia sẻ ngang qua các đối tác hạ tầng chuyên biệt:</p>
                <ul className="list-none pl-0 space-y-2">
                   <li className="flex gap-3">
                      <span className="font-bold text-indigo-600 flex-shrink-0">a)</span>
                      <span>Google Firebase: Quản lý xác thực và cơ sở dữ liệu.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="font-bold text-indigo-600 flex-shrink-0">b)</span>
                      <span>Stripe / PayOS: Thực thi các giao dịch thanh toán bảo mật.</span>
                   </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="muc-3" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">3</div>
             <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight m-0">QUYỀN TỰ QUYẾT CỦA BẠN</h2>
          </div>
          <div className="pl-1 pl-md-14 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">3.1</span> Quy trình giải thể dữ liệu
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Bạn có quyền yêu cầu xóa vĩnh viễn tài khoản và dữ liệu liên quan. Hệ thống sẽ thực thi lệnh xóa triệt để tại máy chủ trong vòng tối đa bảy (7) ngày theo yêu cầu của Bạn.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">3.2</span> Liên hệ hỗ trợ dữ liệu
              </h3>
              <div className="pl-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>Mọi yêu cầu liên quan đến quyền truy xuất dữ liệu cá nhân vui lòng gửi tới ban thư ký pháp chế thông qua hộp thư điện tử chính thức được niêm yết trên hệ thống.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
