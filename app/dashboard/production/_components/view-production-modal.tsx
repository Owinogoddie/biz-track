import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Production } from '@/types/production'
import { MaterialsTab } from './tabs/materials-tab'
import { LaborTab } from './tabs/labor-tab'
import { QualityTab } from './tabs/quality-tab'
import { StepsTab } from './tabs/steps-tab'

interface ViewProductionModalProps {
  production: Production
  onClose?: () => void
}

export function ViewProductionModal({ production, onClose }: ViewProductionModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Production Details - {production.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="labor">Labor</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials">
            <MaterialsTab production={production} />
          </TabsContent>
          
          <TabsContent value="labor">
            <LaborTab production={production} />
          </TabsContent>
          
          <TabsContent value="quality">
            <QualityTab production={production} />
          </TabsContent>
          
          <TabsContent value="steps">
            <StepsTab production={production} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}