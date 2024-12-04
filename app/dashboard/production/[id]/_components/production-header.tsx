'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation'

interface ProductionHeaderProps {
  productName: string
  batchNumber: string
}

export function ProductionHeader({ productName, batchNumber }: ProductionHeaderProps) {
  const router = useRouter()
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h2 className="text xl md:text-2xl font-bold tracking-tight">
          {productName || 'Unnamed Production'}
        </h2>
        <p className="text-muted-foreground">
          Batch Number: {batchNumber}
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={() => router.push('/dashboard/productions')}
        className="w-full sm:w-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Productions
      </Button>
    </div>
  )
}
