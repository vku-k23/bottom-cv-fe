import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to home page without locale
  redirect('/home')
}
