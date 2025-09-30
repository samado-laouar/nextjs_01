'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  // Handle clicking outside the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div
        className="rounded-lg shadow-xl bg-white p-6 w-full max-w-md"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        >
        <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-lg font-semibold">
            {title}
            </h2>
            <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
            >
            <X className="h-5 w-5" />
            </button>
        </div>
        <p id="modal-description" className="mb-6 text-gray-600">
            {message}
        </p>
        <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
            {cancelLabel}
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
            </Button>
        </div>
        </div>
    </div>
    );
}