'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  systemConfigService,
  type SystemConfigRequest,
} from '@/lib/systemConfigService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'
import { Save, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  // Fetch system config
  const { data: config, isLoading } = useQuery({
    queryKey: ['system-config'],
    queryFn: () => systemConfigService.getSystemConfig(),
  })

  const [formData, setFormData] = useState<SystemConfigRequest>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
    passwordMinLength: 8,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    maintenanceMode: false,
  })

  // Update form when config loads
  useState(() => {
    if (config) {
      setFormData({
        siteName: config.siteName,
        siteDescription: config.siteDescription || '',
        contactEmail: config.contactEmail || '',
        contactPhone: config.contactPhone || '',
        logoUrl: config.logoUrl || '',
        passwordMinLength: config.passwordMinLength,
        sessionTimeoutMinutes: config.sessionTimeoutMinutes,
        maxLoginAttempts: config.maxLoginAttempts,
        maintenanceMode: config.maintenanceMode,
        maintenanceMessage: config.maintenanceMessage || '',
      })
    }
  })

  // Mutation
  const updateMutation = useMutation({
    mutationFn: (data: SystemConfigRequest) =>
      systemConfigService.updateSystemConfig(data),
    onSuccess: () => {
      toast.success(t('Admin.settings.settingsSaved'))
      queryClient.invalidateQueries({ queryKey: ['system-config'] })
    },
    onError: () => {
      toast.error(t('Admin.settings.settingsError'))
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync(formData)
  }

  const handleReset = () => {
    if (config) {
      setFormData({
        siteName: config.siteName,
        siteDescription: config.siteDescription || '',
        contactEmail: config.contactEmail || '',
        contactPhone: config.contactPhone || '',
        logoUrl: config.logoUrl || '',
        passwordMinLength: config.passwordMinLength,
        sessionTimeoutMinutes: config.sessionTimeoutMinutes,
        maxLoginAttempts: config.maxLoginAttempts,
        maintenanceMode: config.maintenanceMode,
        maintenanceMessage: config.maintenanceMessage || '',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">
            {t('Admin.settings.loadingSettings')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Admin.settings.title')}
        </h1>
        <p className="mt-1 text-gray-600">{t('Admin.settings.description')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.settings.general')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">
                  {t('Admin.settings.siteName')} *
                </Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  {t('Admin.settings.contactEmail')}
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">
                {t('Admin.settings.siteDescription')}
              </Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) =>
                  setFormData({ ...formData, siteDescription: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  {t('Admin.settings.contactPhone')}
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">{t('Admin.settings.logoUrl')}</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.settings.security')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">
                  {t('Admin.settings.passwordMinLength')}
                </Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  min="6"
                  max="20"
                  value={formData.passwordMinLength}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordMinLength: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  {t('Admin.settings.sessionTimeout')}
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sessionTimeoutMinutes: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">
                  {t('Admin.settings.maxLoginAttempts')}
                </Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={formData.maxLoginAttempts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxLoginAttempts: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.settings.maintenanceMode')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('Admin.settings.enableMaintenanceMode')}</Label>
                <p className="text-sm text-gray-500">
                  {t('Admin.settings.maintenanceDescription')}
                </p>
              </div>
              <Switch
                checked={formData.maintenanceMode}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, maintenanceMode: checked })
                }
              />
            </div>

            {formData.maintenanceMode && (
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">
                  {t('Admin.settings.maintenanceMessage')}
                </Label>
                <Textarea
                  id="maintenanceMessage"
                  value={formData.maintenanceMessage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceMessage: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder={t('Admin.settings.maintenancePlaceholder')}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('Admin.settings.reset')}
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateMutation.isPending
              ? t('Admin.settings.saving')
              : t('Admin.settings.saveSettings')}
          </Button>
        </div>
      </form>
    </div>
  )
}
