'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AssetType, MaintenanceStatus, InventoryAsset } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useInventoryStore } from '@/store/useInventoryStore'
import { updateAsset } from '@/app/actions/inventory'
import { Loader2 } from "lucide-react"

const assetSchema = z.object({
  name: z.string().min(2, 'Asset name must be at least 2 characters'),
  description: z.string().optional(),
  assetType: z.nativeEnum(AssetType),
  serialNumber: z.string().optional(),
  purchaseDate: z.string(),
  condition: z.nativeEnum(MaintenanceStatus),
  nextMaintenance: z.string().optional(),
  notes: z.string().optional(),
})

type AssetFormValues = z.infer<typeof assetSchema>

interface EditAssetModalProps {
  asset: InventoryAsset
  onClose?: () => void
}

export function EditAssetModal({ asset, onClose }: EditAssetModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateAsset: updateAssetStore } = useInventoryStore()

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: asset.name,
      description: asset.description || '',
      assetType: asset.assetType,
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate.toISOString().split('T')[0],
      condition: asset.condition,
      nextMaintenance: asset.nextMaintenance 
        ? asset.nextMaintenance.toISOString().split('T')[0]
        : undefined,
      notes: asset.notes || '',
    },
  })

  async function onSubmit(data: AssetFormValues) {
    setIsLoading(true)
    const result = await updateAsset({
      id: asset.id,
      ...data,
      purchaseDate: new Date(data.purchaseDate),
      nextMaintenance: data.nextMaintenance ? new Date(data.nextMaintenance) : null,
    })
    
    if (result.success) {
      updateAssetStore(result.asset)
      toast({
        title: 'Asset updated!',
        description: 'Your asset has been updated successfully.',
      })
      onClose?.()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsLoading(false)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>
            Make changes to your asset here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter asset name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(AssetType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter serial number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(MaintenanceStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextMaintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Maintenance Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Edit Asset
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}