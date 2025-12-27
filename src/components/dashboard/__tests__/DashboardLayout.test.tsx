import { render } from '@testing-library/react'
import { DashboardLayout } from '../DashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { Role } from '@/types'

// Mock the auth store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>

// Mock the router
jest.mock('@/i18n/routing', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('DashboardLayout', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: Role.CANDIDATE,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as ReturnType<typeof useAuthStore>)
  })

  it('renders candidate navigation items', () => {
    const { getByText } = render(
      <DashboardLayout>
        <div>Test content</div>
      </DashboardLayout>
    )

    expect(getByText('Overview')).toBeInTheDocument()
    expect(getByText('Applied Jobs')).toBeInTheDocument()
    expect(getByText('Favorite Jobs')).toBeInTheDocument()
    expect(getByText('Job Alerts')).toBeInTheDocument()
    expect(getByText('CV Builder')).toBeInTheDocument()
  })

  it('renders employer navigation items for employer role', () => {
    const employerUser = {
      ...mockUser,
      role: Role.EMPLOYER,
    }

    mockUseAuthStore.mockReturnValue({
      user: employerUser,
    } as ReturnType<typeof useAuthStore>)

    const { getByText } = render(
      <DashboardLayout>
        <div>Test content</div>
      </DashboardLayout>
    )

    expect(getByText('Overview')).toBeInTheDocument()
    expect(getByText('My Jobs')).toBeInTheDocument()
    expect(getByText('Post Job')).toBeInTheDocument()
    expect(getByText('Applications')).toBeInTheDocument()
    expect(getByText('Company Profile')).toBeInTheDocument()
  })

  it('renders admin navigation items for admin role', () => {
    const adminUser = {
      ...mockUser,
      role: Role.ADMIN,
    }

    mockUseAuthStore.mockReturnValue({
      user: adminUser,
    } as ReturnType<typeof useAuthStore>)

    const { getByText } = render(
      <DashboardLayout>
        <div>Test content</div>
      </DashboardLayout>
    )

    expect(getByText('Overview')).toBeInTheDocument()
    expect(getByText('Analytics')).toBeInTheDocument()
    expect(getByText('Profile')).toBeInTheDocument()
    expect(getByText('Settings')).toBeInTheDocument()
  })
})
