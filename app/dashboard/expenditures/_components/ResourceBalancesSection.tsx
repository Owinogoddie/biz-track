// "use client"

// import { useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useBusinessStore } from "@/store/useBusinessStore"
// import { useResourceStore } from "@/store/useResourceStore"
// import { getResourceBalances } from "@/app/actions/moneyResource"
// import { formatCurrency } from "@/lib/formatters"
// import { TransactionSourceEnum } from "@/types/expenditure"

// const sourceLabels: Record<TransactionSourceEnum, string> = {
//   BUSINESS_OPERATIONS: "Business Operations",
//   LOAN: "Loans",
//   GIFT: "Gifts",
//   INVESTMENT: "Investments",
//   PERSONAL_FUNDS: "Personal Funds",
//   OTHER: "Other Sources"
// }

// const sourceColors: Record<TransactionSourceEnum, string> = {
//   BUSINESS_OPERATIONS: "text-green-600",
//   LOAN: "text-orange-600",
//   GIFT: "text-purple-600",
//   INVESTMENT: "text-blue-600",
//   PERSONAL_FUNDS: "text-teal-600",
//   OTHER: "text-gray-600"
// }

// export function ResourceBalancesSection() {
//   const currentBusiness = useBusinessStore((state) => state.currentBusiness)
//   const { balances, setBalances } = useResourceStore()

//   useEffect(() => {
//     async function fetchBalances() {
//       if (!currentBusiness) return
//       const result = await getResourceBalances(currentBusiness.id)
//       if (result.success) {
//         setBalances(result.balances)
//       }
//     }
//     fetchBalances()
//   }, [currentBusiness, setBalances])

//   const totalBalance = balances.reduce((sum, balance) => sum + balance.available, 0)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Total Available Balance</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
//         </CardContent>
//       </Card>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {Object.values(TransactionSourceEnum).map((source) => {
//           const balance = balances.find(b => b.source === source)
//           const available = balance?.available || 0
//           const total = balance?.total || 0
          
//           return (
//             <Card key={source}>
//               <CardHeader>
//                 <CardTitle className="flex justify-between items-center">
//                   <span>{sourceLabels[source]}</span>
//                   {balance && (
//                     <span className={`text-sm ${sourceColors[source]}`}>
//                       {((available / total) * 100).toFixed(1)}%
//                     </span>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Available:</span>
//                     <span className={`font-bold ${sourceColors[source]}`}>
//                       {formatCurrency(available)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Total Received:</span>
//                     <span className="font-semibold">
//                       {formatCurrency(total)}
//                     </span>
//                   </div>
//                   {balance && (
//                     <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
//                       <div
//                         className={`h-2.5 rounded-full ${sourceColors[source].replace('text-', 'bg-')}`}
//                         style={{ width: `${(available / total) * 100}%` }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     </div>
//   )
// }