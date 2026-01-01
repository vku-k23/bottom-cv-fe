'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ArrowRight,
  Trash2,
  MoreVertical,
  Mail,
  Download,
  Info,
  Bookmark,
} from 'lucide-react'
import {
  candidateService,
  SavedCandidateResponse,
} from '@/lib/candidateService'
import { toast } from 'react-hot-toast'

export default function SavedCandidatesPage() {
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] =
    useState<SavedCandidateResponse | null>(null)

  // Fetch saved candidates
  const { data, isLoading, error } = useQuery({
    queryKey: ['saved-candidates'],
    queryFn: () =>
      candidateService.getSavedCandidates({
        pageNo: 0,
        pageSize: 50,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
  })

  // Remove saved candidate mutation
  const removeMutation = useMutation({
    mutationFn: (id: number) => candidateService.removeSavedCandidate(id),
    onSuccess: () => {
      toast.success('Candidate removed from saved list')
      queryClient.invalidateQueries({ queryKey: ['saved-candidates'] })
      setDeleteDialogOpen(false)
      setSelectedCandidate(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove candidate')
    },
  })

  // Handle remove click
  const handleRemoveClick = (candidate: SavedCandidateResponse) => {
    setSelectedCandidate(candidate)
    setDeleteDialogOpen(true)
  }

  // Handle confirm remove
  const handleConfirmRemove = () => {
    if (selectedCandidate) {
      removeMutation.mutate(selectedCandidate.id)
    }
  }

  // Handle send email
  const handleSendEmail = (candidate: SavedCandidateResponse) => {
    if (!candidate.candidateEmail) {
      toast.error('Candidate email not available')
      return
    }
    const subject = `Regarding Your Application - ${candidate.jobTitle || 'Position'}`
    const message = `Dear ${candidate.candidateName},\n\nWe would like to discuss your application further.\n\nBest regards`
    const mailtoLink = `mailto:${candidate.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.location.href = mailtoLink
  }

  // Handle view profile (for now just show a toast - can be linked to a profile page)
  const handleViewProfile = (candidate: SavedCandidateResponse) => {
    // Navigate to candidate profile or applications page
    window.location.href = `/admin/applications?candidateId=${candidate.candidateId}`
  }

  const candidates = data?.data || []

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-[#0A65CC]" />
          <h1 className="text-xl font-medium text-gray-900">
            Saved Candidates
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="h-5 w-5 text-gray-400" />
          <span>
            {candidates.length > 0
              ? `${candidates.length} saved candidate${candidates.length !== 1 ? 's' : ''}`
              : 'No saved candidates yet'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A65CC] border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
          Failed to load saved candidates. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && candidates.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
          <Bookmark className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Saved Candidates
          </h3>
          <p className="text-sm text-gray-500">
            Start saving candidates from the Applications page to see them here.
          </p>
        </div>
      )}

      {/* Candidates List */}
      {!isLoading && !error && candidates.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white">
          {candidates.map((candidate, index) => (
            <div key={candidate.id}>
              {/* Candidate Card */}
              <div className="flex items-center justify-between p-5 transition-colors hover:bg-gray-50">
                {/* Left: Profile Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded bg-gray-200">
                    {candidate.candidateAvatar ? (
                      <Image
                        src={candidate.candidateAvatar}
                        alt={candidate.candidateName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-500">
                        {candidate.candidateName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name and Job Title */}
                  <div className="flex flex-col">
                    <h3 className="text-base font-medium text-gray-900">
                      {candidate.candidateName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {candidate.jobTitle || 'Applied Position'}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded bg-[#FFEAEA] text-[#E05151] hover:bg-[#FFD5D5] hover:text-[#C94444]"
                    onClick={() => handleRemoveClick(candidate)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  {/* View Profile Button */}
                  <Button
                    variant="secondary"
                    className="h-12 gap-2 bg-[#E7F0FA] px-6 text-[#0A65CC] hover:bg-[#D0E5F5]"
                    onClick={() => handleViewProfile(candidate)}
                  >
                    View Profile
                    <ArrowRight className="h-5 w-5" />
                  </Button>

                  {/* More Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="gap-3"
                        onClick={() => handleSendEmail(candidate)}
                      >
                        <Mail className="h-5 w-5 text-gray-500" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3">
                        <Download className="h-5 w-5 text-gray-500" />
                        Download CV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Divider */}
              {index < candidates.length - 1 && (
                <div className="h-px bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Saved Date Info */}
      {!isLoading && !error && candidates.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          <span>
            Showing {candidates.length} saved candidate
            {candidates.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Saved Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{selectedCandidate?.candidateName}</strong> from your
              saved candidates? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-red-500 hover:bg-red-600"
            >
              {removeMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
