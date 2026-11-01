import { useFormContext } from 'react-hook-form'

export default function PersonalInfoStep() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500">
          How employers or academic committees can reach you.
        </p>
      </div>

      {/* Document Type & Currency quick settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-100 rounded-lg border border-slate-200">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Document Mode
          </label>
          <select
            {...register('documentType')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          >
            <option value="resume">Resume (1-Page Target)</option>
            <option value="cv">Curriculum Vitae / CV (Multi-Page)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Currency (for Org Metrics)
          </label>
          <select
            {...register('currency')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          >
            <option value="PHP">PHP (₱)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="SGD">SGD (S$)</option>
          </select>
        </div>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Maria Clara Santos"
            {...register('personalInfo.fullName')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="maria.santos@university.edu.ph"
            {...register('personalInfo.email')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="text"
            placeholder="+63 917 123 4567"
            {...register('personalInfo.phone')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Quezon City, Metro Manila"
            {...register('personalInfo.location')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
          <input
            type="text"
            placeholder="linkedin.com/in/mariasantos"
            {...register('personalInfo.linkedin')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Portfolio / GitHub Website
          </label>
          <input
            type="text"
            placeholder="mariasantos.dev or github.com/mariasantos"
            {...register('personalInfo.portfolio')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

