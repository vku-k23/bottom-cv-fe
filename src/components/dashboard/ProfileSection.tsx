'use client'

import { useEffect, useState } from 'react'
import { profileApi } from '@/lib/profileApi'
import { ProfileResponse, ProfileRequest } from '@/types/profile'
import { useTranslation } from '@/hooks/useTranslation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
export function ProfileSection() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProfileRequest>({
    firstName: '',
    lastName: '',
    dayOfBirth: '',
    address: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    description: '',
  })

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const response = await profileApi.getProfile()
        setProfile(response)

        // Populate form data
        setFormData({
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          dayOfBirth: response.dayOfBirth || '',
          address: response.address || '',
          email: response.email || '',
          phoneNumber: response.phoneNumber || '',
          avatar: response.avatar || '',
          description: response.description || '',
        })
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const response = await profileApi.updateProfile(formData)
      setProfile(response)
      setIsEditing(false)
      setSuccessMessage(t('Profile.successMessage'))

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dayOfBirth: profile.dayOfBirth || '',
        address: profile.address || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        avatar: profile.avatar || '',
        description: profile.description || '',
      })
    }
    setIsEditing(false)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('Profile.loadingProfile')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Profile.title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('Profile.subtitle')}</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-block">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-30 w-30 items-center justify-center rounded-full bg-gray-300">
                    <span className="text-2xl font-medium text-gray-600">
                      {profile?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mt-4">
                  <Label htmlFor="avatar" className="text-sm font-medium">
                    {t('Profile.avatarUrl')}
                  </Label>
                  <Input
                    id="avatar"
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder={t('Profile.avatarPlaceholder')}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('Profile.personalInfo')}</CardTitle>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {t('Profile.editButton')}
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        {t('Profile.cancelButton')}
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving
                          ? t('Profile.savingButton')
                          : t('Profile.saveButton')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    {t('Profile.firstName')}{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile?.firstName || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    {t('Profile.lastName')}{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile?.lastName || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dayOfBirth" className="text-sm font-medium">
                    {t('Profile.dateOfBirth')}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dayOfBirth"
                      type="date"
                      name="dayOfBirth"
                      value={formData.dayOfBirth}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile?.dayOfBirth || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    {t('Profile.phoneNumber')}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile?.phoneNumber || '-'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    {t('Profile.address')}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile?.address || '-'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Me */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Profile.aboutMe')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t('Profile.aboutPlaceholder')}
                />
              ) : (
                <p className="text-gray-900">{profile?.description || '-'}</p>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Profile.accountInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    {t('Profile.email')}
                  </Label>
                  <p className="mt-1 text-gray-900">{profile?.email || '-'}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    {t('Profile.accountId')}
                  </Label>
                  <p className="mt-1 text-gray-900">{profile?.id || '-'}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    {t('Profile.createdAt')}
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {profile?.createdAt || '-'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    {t('Profile.lastUpdated')}
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {profile?.updatedAt || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
