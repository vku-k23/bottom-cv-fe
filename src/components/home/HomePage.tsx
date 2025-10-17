import { Hero } from '@/components/home/Hero'
import { PopularVacancies } from '@/components/home/PopularVacancies'
import { HowItWorks } from '@/components/home/HowItWorks'
import { PopularCategories } from '@/components/home/PopularCategories'
import { FeaturedJobs } from '@/components/home/FeaturedJobs'
import { TopCompanies } from '@/components/home/TopCompanies'
import { Testimonials } from '@/components/home/Testimonials'
import { CTASections } from '@/components/home/CTASections'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <PopularVacancies />
      <HowItWorks />
      <PopularCategories />
      <FeaturedJobs />
      <TopCompanies />
      <Testimonials />
      <CTASections />
    </div>
  )
}
