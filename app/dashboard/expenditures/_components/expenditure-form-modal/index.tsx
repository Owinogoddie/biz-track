// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Expenditure } from "@prisma/client"
// import { ExpenditureForm } from "./ExpenditureForm"

// interface ExpenditureFormModalProps {
//   expenditure?: Expenditure
//   availableBalance?: number
//   children: React.ReactNode
// }

// export function ExpenditureFormModal({ expenditure, availableBalance, children }: ExpenditureFormModalProps) {
//   const [open, setOpen] = useState(false)

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>{expenditure ? "Edit Expenditure" : "Add Expenditure"}</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-6 md:grid-cols-2">
//           <div>
//             <ExpenditureForm
//               defaultValues={expenditure}
//               onSuccess={() => setOpen(false)}
//               onCancel={() => setOpen(false)}
//             />
//           </div>
//           <div>
//             {availableBalance !== undefined && (
//               <div className="p-4 bg-muted rounded-lg">
//                 <p className="text-sm text-muted-foreground">Available Balance</p>
//                 <p className="text-2xl font-semibold">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(availableBalance)}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }