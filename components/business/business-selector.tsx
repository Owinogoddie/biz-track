"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useBusinessStore } from "@/store/useBusinessStore"
import { CreateBusinessModal } from "@/components/modals/create-business-modal"
import { useRouter } from "next/navigation"

export function BusinessSelector() {
  const [open, setOpen] = React.useState(false)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const { currentBusiness, businesses, setCurrentBusiness } = useBusinessStore()
  const router = useRouter()

  const handleBusinessCreated = () => {
    setShowCreateModal(false)
    router.refresh()
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {currentBusiness?.name || "Select business..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search business..." />
            <CommandList>
              <CommandEmpty>No business found.</CommandEmpty>
              <CommandGroup>
                {businesses?.map((business) => (
                  <CommandItem
                    key={business.id}
                    value={business.name}
                    onSelect={() => {
                      setCurrentBusiness(business)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentBusiness?.id === business.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {business.name}
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => {
                    setShowCreateModal(true)
                    setOpen(false)
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create new business
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {showCreateModal && (
        <CreateBusinessModal
          userId="user-id"
          onClose={handleBusinessCreated}
        />
      )}
    </>
  )
}