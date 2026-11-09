import { useFormContext } from 'react-hook-form'

export default function SummaryStep() {
  const { register, watch } = useFormContext()
  const isOjtMode = Boolean(watch('isOjtMode'))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[#1A2233]">
          {isOjtMode ? 'Career Objective' : 'Professional Summary'}
        </h2>
        <p className="text-sm text-[#5B6678]">
          Write 2–3 sentences highlighting your degree, key strengths, and what role you are looking for. Leave blank to hide this section.
        </p>
      </div>

      {/* Tip callout */}
      <div className="rounded-[10px] border border-[#E3E8EE] bg-[#F6F8FA] p-3.5 text-xs text-[#5B6678] leading-relaxed">
        <strong className="font-semibold text-[#1A2233]">Tip:</strong>{' '}
        {isOjtMode
          ? 'For OJT applications, state your year level, degree program, target internship role, and the skills you are eager to apply in a professional environment.'
          : 'Summaries are completely optional for students and recent grads. You can leave this blank so you have more room for your education, internships, and technical projects to keep your resume on 1 clean page.'}
      </div>

      <div>
        <label
          htmlFor="summary-textarea"
          className="block text-sm font-medium text-[#1A2233] mb-1"
        >
          {isOjtMode ? 'Career Objective' : 'Summary'}
        </label>
        <textarea
          id="summary-textarea"
          rows={5}
          placeholder={
            isOjtMode
              ? 'e.g. A fourth-year Bachelor of Science in Information Technology student seeking an On-the-Job Training (OJT) internship position where technical knowledge, problem-solving abilities, and teamwork skills can be applied in a professional IT environment.'
              : 'e.g. Detail-oriented Computer Science senior with hands-on experience in full-stack software development and student leadership...'
          }
          {...register('summary')}
          className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
        />
      </div>
    </div>
  )
}
