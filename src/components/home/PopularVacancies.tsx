import { useTranslations } from 'next-intl'
const vacancies = [
  'Anesthesiologists',
  'Maxillofacial Surgeons',
  'Financial Manager',
  'Surgeons',
  'Software Developer',
  'Management Analysis',
  'Obstetricians-Gynecologists',
  'Psychiatrists',
  'IT Manager',
  'Orthodontists',
  'Data Scientist',
  'Operations Research Analysis',
]

export function PopularVacancies() {
  const t = useTranslations('PopularVacancies')
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-xl font-semibold text-gray-900 md:text-2xl">
          {t('heading')}
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-[11px] font-medium text-gray-600 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {vacancies.map((v) => (
            <div key={v} className="space-y-1">
              <p className="cursor-pointer text-[11px] font-semibold text-gray-800 hover:text-blue-600">
                {v}
              </p>
              <p className="text-[10px] text-gray-400">
                5,305 {t('openPositions')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
