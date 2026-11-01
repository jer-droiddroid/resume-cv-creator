import { useFormContext } from 'react-hook-form'

export default function SummaryStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Professional Summary</h2>
        <p className="text-sm text-slate-500">
          Write 2–3 sentences highlighting your degree, key strengths, and what role you are looking for. Leave blank to hide this section.
        </p>
      </div>

      {/* r/resumes Community Guidance */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-start gap-2">
        <span className="text-base leading-none">💡</span>
        <div>
          <strong className="font-semibold">r/resumes Wiki Tip:</strong> Summaries are completely optional for students and recent grads! The wiki recommends leaving this blank so you have more room for your education, internships, and technical projects to keep your resume on 1 clean page.
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
        <textarea
          rows={5}
          placeholder="e.g. Detail-oriented Computer Science senior with hands-on experience in full-stack web development and student leadership..."
          {...register('summary')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
        />
      </div>
    </div>
  )
}

