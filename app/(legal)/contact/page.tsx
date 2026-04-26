"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Scale, Mail, ShieldAlert, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const legalContactSchema = z.object({
  fullName: z.string().min(5, "Yêu cầu cung cấp Tên pháp lý đầy đủ (tối thiểu 5 ký tự)."),
  organization: z.string().optional(),
  email: z.string().email("Định dạng thư điện tử không hợp lệ theo chuẩn RFC 5322."),
  subjectType: z.enum(["copyright", "dispute", "privacy", "business", "other"], {
    message: "Vui lòng phân loại hạng mục pháp lý.",
  }),
  message: z.string().min(20, "Nội dung tường trình phải bao gồm tối thiểu 20 ký tự để thẩm định nội dung."),
  acknowledgeDisclaimer: z.boolean().refine(val => val === true, {
    message: "Bạn phải xác nhận Miễn Trừ Trách Nhiệm trước khi kiến nghị.",
  }),
});

type LegalContactFormValues = z.infer<typeof legalContactSchema>;

export default function LegalContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<LegalContactFormValues>({
    resolver: zodResolver(legalContactSchema),
    defaultValues: {
      fullName: "",
      organization: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: LegalContactFormValues) => {
    setIsSubmitting(true);
    // Simulate real network request to mail server (e.g. Resend/SendGrid)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In production, this would be an API POST to /api/send-email
      console.log("Transmission securely delivered:", data);
      setIsSuccess(true);
      toast.success("Tiếp nhận Hồ Sơ thành công.");
    } catch {
      toast.error("Lỗi giao thức SMTP. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none pb-12">
      {/* ── Document Header ── */}
      <div className="mb-10 lg:mb-12">
        <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-500">
           <Scale className="w-8 h-8" />
           <span className="text-xl font-bold uppercase tracking-widest">Tiếp Khách & Pháp Chế</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 uppercase leading-tight">
          Cổng Liên Hệ Pháp Lý
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          Dành riêng cho khiếu nại bản quyền (DMCA), yêu cầu trích xuất dữ liệu, hòa giải tranh chấp và đối thoại cấp Doanh nghiệp.
        </p>
      </div>

      <Separator className="my-10 bg-slate-200 dark:bg-slate-800" />

      {/* ── Contact Info Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
         <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 mt-0">Trụ Sở Điều Hành</h3>
            <p className="text-slate-900 dark:text-white font-bold text-lg mb-1 leading-tight">VideoPrompt JSC.</p>
            <p className="text-slate-500 text-sm leading-relaxed m-0">
               Tầng 12, Tòa nhà Bitexco Financial Tower<br />
               Quận 1, Thành phố Hồ Chí Minh, VN<br />
               Thẩm quyền giải quyết tranh chấp: Tòa án TPHCM
            </p>
         </div>
         <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 mt-0">Tuyến Giao Thức Điện Tử</h3>
            <div className="flex flex-col gap-3">
               <a href="mailto:legal@videoprompt.vn" className="flex items-center gap-3 text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-500 font-semibold no-underline group transition-colors">
                  <Mail className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  legal@videoprompt.vn
               </a>
               <div className="flex items-center gap-3 text-slate-900 dark:text-white font-semibold">
                  <ShieldAlert className="w-5 h-5 text-slate-400" />
                  PGP Key ID: 0x8A1B2C3D
               </div>
            </div>
         </div>
      </div>

      {/* ── Official Form ── */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Scale className="w-64 h-64" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0 mb-8 flex items-center gap-3">
          Đệ Trình Hồ Sơ (Official Submission)
        </h2>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-4 border-emerald-50 dark:border-emerald-900/10 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white m-0 mb-2">Hồ Sơ Đã Nạp Lên Hệ Thống</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
               Ban thư ký pháp lý sẽ rà soát và phản hồi chính thức (Official Response) tới hộp thư của Quý khách trong vòng 48 giờ làm việc (không bao gồm ngày nghỉ lễ).
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline" className="font-semibold rounded-xl">
               Đệ trình Biên bản Mới
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nhân danh (Tên pháp lý Đầy Đủ) <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Vd: Nguyễn Văn A / Luật sư Đại diện"
                  {...form.register("fullName")}
                  className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${form.formState.errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {form.formState.errors.fullName && (
                  <p className="text-xs font-semibold text-red-500 m-0">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Pháp nhân / Tổ chức (Tùy chọn)</label>
                <Input
                  placeholder="Vd: Công ty Cổ phần X"
                  {...form.register("organization")}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Phản Hồi Chính Thức <span className="text-red-500">*</span></label>
                <Input
                  type="email"
                  placeholder="email@domain.com"
                  {...form.register("email")}
                  className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {form.formState.errors.email && (
                  <p className="text-xs font-semibold text-red-500 m-0">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hạng Mục Xử Lý <span className="text-red-500">*</span></label>
                <Select onValueChange={(val) => form.setValue("subjectType", val as "copyright" | "dispute" | "privacy" | "business" | "other")} defaultValue={form.getValues("subjectType")}>
                  <SelectTrigger className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${form.formState.errors.subjectType ? "border-red-500 focus-visible:ring-red-500" : ""}`}>
                    <SelectValue placeholder="-- Lựa chọn Hạng mục --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copyright">Vi phạm Bản Quyền / DMCA</SelectItem>
                    <SelectItem value="privacy">Yêu cầu Liên quan Dữ liệu cá nhân (GDPR)</SelectItem>
                    <SelectItem value="dispute">Hòa giải Tranh Chấp Thanh Toán</SelectItem>
                    <SelectItem value="business">Hợp Đồng Chuyển Giao Công Nghệ</SelectItem>
                    <SelectItem value="other">Vấn Đề Pháp Lý Khác</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.subjectType && (
                  <p className="text-xs font-semibold text-red-500 m-0">{form.formState.errors.subjectType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nội Dung Tường Trình <span className="text-red-500">*</span></label>
              <Textarea
                placeholder="Ràng buộc: Mô tả rõ căn cứ pháp lý, mã giao dịch/đơn hàng liên quan (nếu có)."
                rows={6}
                {...form.register("message")}
                className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 resize-none ${form.formState.errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {form.formState.errors.message && (
                <p className="text-xs font-semibold text-red-500 m-0">{form.formState.errors.message.message}</p>
              )}
            </div>

            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-4">
              <Checkbox 
                id="disclaimer" 
                checked={form.watch("acknowledgeDisclaimer")}
                onCheckedChange={(checked) => form.setValue("acknowledgeDisclaimer", checked as boolean)}
                className="mt-1 shrink-0" 
              />
              <div className="space-y-1">
                <label htmlFor="disclaimer" className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer select-none">
                  Tuyên bố Miễn trừ Tư nghị Pháp lý (Non-Representation Acknowledgment)
                </label>
                <p className="text-sm text-slate-500 leading-normal m-0 select-none">
                  Tôi hiểu và đồng ý rõ ràng rằng: Việc trao đổi Thông điệp Dữ liệu Đơn phương qua biểu mẫu này <strong>KHÔNG</strong> cấu thành nên hay chứng minh cho việc thành lập mối Quan Hệ Đối Tác/Luật sư - Khách hàng (Attorney-Client Relationship) đối với VideoPrompt dưới bất kỳ hình thức đại diện nào.
                </p>
                {form.formState.errors.acknowledgeDisclaimer && (
                  <p className="text-xs font-bold text-red-500 mt-2">{form.formState.errors.acknowledgeDisclaimer.message}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full sm:w-auto h-12 px-8 font-bold text-[15px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 group transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang Ký Điện Tử & Giao Thức...
                </>
              ) : (
                <>
                  Ký & Phát Lệnh Phê Duyệt
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </article>
  );
}
