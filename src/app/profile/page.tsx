'use client'

import { useEffect, useState } from 'react'
import { profileApi } from '@/lib/profileApi'
import { ProfileResponse, ProfileRequest } from '@/types/profile'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/stores/authStore'
import Image from 'next/image'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { fetchCurrentUser } = useAuthStore()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string>('')

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
        setPreviewAvatar(response.avatar || '')

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Basic validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return
      }

      try {
        setIsUploading(true)
        setError(null)
        
        const response = await profileApi.uploadAvatar(file)
        
        if (response.success) {
          setPreviewAvatar(response.fileUrl)
          setFormData((prev) => ({
            ...prev,
            avatar: response.objectName,
          }))
          // Optionally update profile immediately if needed, but saving is handled by handleSave
          setSuccessMessage(t('Profile.avatarUploadSuccess') || 'Avatar uploaded successfully')
          await fetchCurrentUser(true) // Refresh auth store to update header avatar
          setTimeout(() => setSuccessMessage(null), 3000)
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
        setError('Failed to upload avatar')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const response = await profileApi.updateProfile(formData)
      setProfile(response)
      await fetchCurrentUser(true) // Refresh auth store
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
      setPreviewAvatar(profile.avatar || '')
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('Profile.loadingProfile')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('Profile.title')}
                </h1>
                <p className="text-gray-600">{t('Profile.subtitle')}</p>
              </div>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {t('Profile.editButton')}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    >
                      {t('Profile.cancelButton')}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving
                        ? t('Profile.savingButton')
                        : t('Profile.saveButton')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {successMessage && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4">
                <p className="text-green-800">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block group">
                    {previewAvatar && (previewAvatar.startsWith('http') || previewAvatar.startsWith('/')) ? (
                      <Image
                        src={previewAvatar}
                        alt="Profile"
                        width={120}
                        height={120}
                        className="rounded-full object-cover w-[120px] h-[120px]"
                      />
                    ) : (
                      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gray-300">
                        <span className="text-2xl font-medium text-gray-600">
                          {profile?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <label htmlFor="avatar-upload" className="cursor-pointer text-white text-sm font-medium">
                          {isUploading ? 'Uploading...' : 'Change'}
                        </label>
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarUpload}
                          disabled={isUploading}
                        />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Click on the image to change
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      {t('Profile.personalInfo')}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.firstName')}{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.firstName || '-'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.lastName')}{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.lastName || '-'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.dateOfBirth')}
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="dayOfBirth"
                            value={formData.dayOfBirth}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.dayOfBirth || '-'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.phoneNumber')}
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.phoneNumber || '-'}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.address')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile?.address || '-'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About Me */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      {t('Profile.aboutMe')}
                    </h3>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder={t('Profile.aboutPlaceholder')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile?.description || '-'}
                      </p>
                    )}
                  </div>

                  {/* Account Information */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      {t('Profile.accountInfo')}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.email')}
                        </label>
                        <p className="text-gray-900">{profile?.email || '-'}</p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.accountId')}
                        </label>
                        <p className="text-gray-900">{profile?.id || '-'}</p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.createdAt')}
                        </label>
                        <p className="text-gray-900">
                          {profile?.createdAt || '-'}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {t('Profile.lastUpdated')}
                        </label>
                        <p className="text-gray-900">
                          {profile?.updatedAt || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
