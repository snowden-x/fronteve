"use client"

import { MedicineForm } from "@/components/forms/medicine-form"

export default function NewMedicinePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Medicine</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <MedicineForm />
      </div>
    </div>
  )
} 