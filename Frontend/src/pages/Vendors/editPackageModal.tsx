"use client"

// - Replaced raw inputs with Label, Input, Textarea
// - Wrapped content in Card with header and close icon
// - Improved overlay with backdrop blur and accessibility attributes
// - Buttons use variants for clear affordances

import type React from "react"
import type { Package } from "@/interface/PackageInterface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, PencilLine } from "lucide-react"

interface EditPackageModalProps {
  pkg: Package | undefined
  onClose: () => void
  onChange: (updated: Package) => void
  onSubmit: (e: React.FormEvent) => void
}

export const EditPackageModal: React.FC<EditPackageModalProps> = ({ pkg, onClose, onChange, onSubmit }) => {
  const safePkg = (pkg ??
    ({
      packageName: "",
      description: "",
      price: 0,
      duration: 1,
    } as Package)) as Package

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-package-title"
      onClick={onClose}
    >
      <Card className="w-full max-w-lg border-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <div className="flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <CardTitle id="edit-package-title" className="text-xl">
              Edit Package
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                type="text"
                value={safePkg.packageName}
                onChange={(e) => onChange({ ...safePkg, packageName: e.target.value })}
                placeholder="e.g. Himalayan Adventure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={safePkg.description}
                onChange={(e) => onChange({ ...safePkg, description: e.target.value })}
                placeholder="Brief overview of the experience, inclusions, and highlights"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price</Label>
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={Number.isFinite(safePkg.price) ? safePkg.price : 0}
                  onChange={(e) => onChange({ ...safePkg, price: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step="1"
                  value={Number.isFinite(safePkg.duration) ? safePkg.duration : 1}
                  onChange={(e) => onChange({ ...safePkg, duration: Number(e.target.value) })}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
