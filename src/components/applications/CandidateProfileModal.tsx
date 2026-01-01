'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { format, parse } from 'date-fns'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Star,
  Mail,
  ArrowRightCircle,
  Download,
  Cake,
  MapPin,
  ClipboardList as ClipboardText,
  UserCircle,
  Layers as Stack,
  GraduationCap,
  Globe2 as Globe,
  Phone,
  FileText,
} from 'lucide-react'
import { ApplyResponse } from '@/lib/applicationService'
import { candidateService } from '@/lib/candidateService'
import { applicationService } from '@/lib/applicationService'
import { toast } from 'react-hot-toast'
import { SendEmailModal } from './SendEmailModal'
import { HireCandidateDialog } from './HireCandidateDialog'

interface CandidateProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: ApplyResponse
  jobTitle?: string
  companyName?: string
}

export function CandidateProfileModal({
  open,
  onOpenChange,
  application,
  jobTitle,
  companyName,
}: CandidateProfileModalProps) {
  const queryClient = useQueryClient()
  const [isSaved, setIsSaved] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isHireDialogOpen, setIsHireDialogOpen] = useState(false)

  // Use candidate profile directly from application response (no separate API call needed)
  const profile = application.candidateProfile

  // Check if candidate is saved (async)
  useEffect(() => {
    const checkSaved = async () => {
      if (open && application.userId && application.jobId) {
        try {
          const saved = await candidateService.checkCandidateSaved(
            application.userId,
            application.jobId
          )
          setIsSaved(saved)
        } catch {
          setIsSaved(false)
        }
      }
    }
    checkSaved()
  }, [open, application.userId, application.jobId])

  // Save candidate mutation (toggle)
  const saveCandidateMutation = useMutation({
    mutationFn: () =>
      candidateService.toggleSaveCandidate(
        application.userId,
        application.jobId
      ),
    onSuccess: (data) => {
      setIsSaved(data.saved)
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['saved-candidates'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save candidate')
    },
  })

  // Download CV handler
  const handleDownloadCV = async () => {
    try {
      const blob = await applicationService.downloadApplicationCV(
        application.id
      )
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CV_${profile?.firstName || 'candidate'}_${profile?.lastName || 'application'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('CV downloaded successfully')
    } catch (_error) {
      toast.error('Failed to download CV')
    }
  }

  const candidateName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : `User ${application.userId}`

  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
    : `U${application.userId}`

  // Format date of birth
  const formatDateOfBirth = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    try {
      const date = parse(dateStr, 'dd-MM-yyyy', new Date())
      return format(date, 'dd MMMM, yyyy')
    } catch {
      return dateStr
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[90vh] min-w-[1024px] overflow-y-auto p-0"
          showCloseButton={true}
        >
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-500">
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={candidateName}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-medium text-white">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Name and Title */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-medium text-gray-900">
                    {candidateName}
                  </h2>
                  <p className="text-base text-gray-500">
                    {jobTitle || 'Applied Position'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Save Candidate Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-12 w-12 rounded-md ${
                    isSaved
                      ? 'bg-[#E7F0FA] text-[#0A65CC]'
                      : 'bg-[#E7F0FA] text-gray-500 hover:text-[#0A65CC]'
                  }`}
                  onClick={() => saveCandidateMutation.mutate()}
                  disabled={saveCandidateMutation.isPending}
                >
                  <Star
                    className={`h-6 w-6 ${isSaved ? 'fill-current' : ''}`}
                  />
                </Button>

                {/* Send Mail Button - Opens new modal */}
                <Button
                  variant="outline"
                  className="h-10 border-2 border-[#0A65CC] px-6 text-[#0A65CC] hover:bg-[#E7F0FA]"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  <Mail className="mr-3 h-5 w-5" />
                  Send Mail
                </Button>

                {/* Hire Candidate Button - Opens confirmation dialog */}
                <Button
                  className="h-10 bg-[#0A65CC] px-6 text-white hover:bg-[#0855B3]"
                  onClick={() => setIsHireDialogOpen(true)}
                >
                  <ArrowRightCircle className="mr-3 h-5 w-5" />
                  Hire Candidate
                </Button>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex gap-12 overflow-y-auto p-6">
              {/* Left Column - Biography and Cover Letter */}
              <div className="flex flex-1 flex-col gap-8">
                {/* Biography Section */}
                {profile?.description && (
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-medium text-gray-900 uppercase">
                      Biography
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600">
                      {profile.description}
                    </p>
                    <div className="h-px bg-gray-100" />
                  </div>
                )}

                {/* Cover Letter Section */}
                {application.coverLetter && (
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-medium text-gray-900 uppercase">
                      Cover Letter
                    </h3>
                    <div className="flex flex-col gap-3">
                      <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-600">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Job Information and Contact */}
              <div className="flex w-80 flex-col gap-6">
                {/* Job Information Card */}
                <div className="rounded-lg border border-[#E7F0FA] bg-white p-6">
                  <div className="flex flex-col gap-6">
                    {/* Date of Birth */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0FA]">
                        <Cake className="h-5 w-5 text-[#0A65CC]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          Date of Birth
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateOfBirth(profile?.dayOfBirth)}
                        </p>
                      </div>
                    </div>

                    {/* Nationality */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0FA]">
                        <MapPin className="h-5 w-5 text-[#0A65CC]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          Nationality
                        </p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                      </div>
                    </div>

                    {/* Marital Status */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0FA]">
                        <ClipboardText className="h-5 w-5 text-[#0A65CC]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          Marital Status
                        </p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0FA]">
                        <UserCircle className="h-5 w-5 text-[#0A65CC]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          Gender
                        </p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0FA]">
                        <Stack className="h-5 w-5 text-[#0A65CC]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          Experience
                        </p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0FA]">
                        <GraduationCap className="h-5 w-5 text-[#0A65CC]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          Education
                        </p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Resume Card */}
                {application.cvUrl && (
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-medium text-gray-900">
                      Download My Resume
                    </h3>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E7F0FA]">
                          <FileText className="h-6 w-6 text-[#0A65CC]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-gray-500">
                            {candidateName}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            PDF
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-md bg-[#E7F0FA] text-[#0A65CC] hover:bg-[#D0E5F5]"
                        onClick={handleDownloadCV}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Contact Information Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-6 text-base font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <div className="flex flex-col gap-5">
                    {/* Website */}
                    <div className="flex items-start gap-4">
                      <Globe className="h-8 w-8 text-gray-400" />
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 uppercase">
                          website
                        </p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Location */}
                    {profile?.address && (
                      <>
                        <div className="flex items-start gap-4">
                          <MapPin className="h-8 w-8 text-gray-400" />
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Location
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {profile.address}
                            </p>
                          </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                      </>
                    )}

                    {/* Phone */}
                    {profile?.phoneNumber && (
                      <>
                        <div className="flex items-start gap-4">
                          <Phone className="h-8 w-8 text-gray-400" />
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Phone
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {profile.phoneNumber}
                            </p>
                          </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                      </>
                    )}

                    {/* Email */}
                    {profile?.email && (
                      <div className="flex items-start gap-4">
                        <Mail className="h-8 w-8 text-gray-400" />
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-gray-500 uppercase">
                            Email address
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Modal */}
      <SendEmailModal
        open={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        application={application}
        jobTitle={jobTitle}
        companyName={companyName}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['email-logs'] })
        }}
      />

      {/* Hire Candidate Dialog */}
      <HireCandidateDialog
        open={isHireDialogOpen}
        onOpenChange={setIsHireDialogOpen}
        application={application}
        jobTitle={jobTitle}
        onSuccess={() => {
          onOpenChange(false)
        }}
      />
    </>
  )
}
