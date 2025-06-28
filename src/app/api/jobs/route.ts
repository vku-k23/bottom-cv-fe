import { NextRequest, NextResponse } from 'next/server'
import { jobSearchSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate search parameters
    const searchData = {
      query: searchParams.get('query') || undefined,
      location: searchParams.get('location') || undefined,
      jobType: searchParams.get('jobType') || undefined,
      isRemote: searchParams.get('isRemote') === 'true' ? true : undefined,
      salaryMin: searchParams.get('salaryMin')
        ? parseInt(searchParams.get('salaryMin')!)
        : undefined,
      salaryMax: searchParams.get('salaryMax')
        ? parseInt(searchParams.get('salaryMax')!)
        : undefined,
      experienceLevel: searchParams.get('experienceLevel') || undefined,
      skills: searchParams.get('skills')?.split(',') || undefined,
      companyId: searchParams.get('companyId')
        ? parseInt(searchParams.get('companyId')!)
        : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    }

    const validatedData = jobSearchSchema.parse(searchData)

    // TODO: Implement job search logic with backend API
    const jobs: unknown[] = []
    const total = 0

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page: validatedData.page,
        limit: validatedData.limit,
        total,
        totalPages: Math.ceil(total / validatedData.limit),
        hasNext: validatedData.page < Math.ceil(total / validatedData.limit),
        hasPrev: validatedData.page > 1,
      },
    })
  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const _body = await request.json()

    // TODO: Implement job creation logic
    // Validate user permissions (HR role only)
    // Create job via backend API

    return NextResponse.json(
      {
        success: true,
        message: 'Job created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
