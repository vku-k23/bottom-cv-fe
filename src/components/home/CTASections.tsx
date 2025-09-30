export function CTASections() {
  return (
    <section className="mt-8 bg-gray-50 py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800">
            Become a Candidate
          </h3>
          <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis.
          </p>
          <button className="mt-4 rounded-md border border-blue-600 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-600 hover:text-white">
            Register Now
          </button>
        </div>
        <div className="rounded-xl border border-gray-200 bg-blue-700 p-8 text-white shadow-sm md:col-span-2">
          <h3 className="text-sm font-semibold">Become a Employers</h3>
          <p className="mt-2 text-[11px] leading-relaxed opacity-90">
            Cras placerat volutpat felis nec lobortis. Maecenas imperdiet leo
            magna, in fringilla lorem fermentum in. Cras placerat volutpat felis
            nec lobortis.
          </p>
          <button className="mt-4 rounded-md border border-white px-4 py-2 text-xs font-medium text-white hover:bg-white hover:text-blue-700">
            Register Now
          </button>
        </div>
      </div>
    </section>
  )
}
