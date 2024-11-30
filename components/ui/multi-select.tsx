import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  emptyMessage?: string
}

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  emptyMessage = "No options available",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Ensure we're working with arrays even if undefined is passed
  const safeOptions = Array.isArray(options) ? options : []
  const safeSelected = Array.isArray(selected) ? selected : []

  const handleUnselect = React.useCallback((option: Option) => {
    const newSelected = safeSelected.filter((s) => s !== option.value)
    onChange(newSelected)
  }, [safeSelected, onChange])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && safeSelected.length > 0) {
            const newSelected = [...safeSelected]
            newSelected.pop()
            onChange(newSelected)
          }
        }
        if (e.key === "Escape") {
          input.blur()
          setOpen(false)
        }
      }
    },
    [safeSelected, onChange]
  )

  // Filter out already selected options
  const selectables = React.useMemo(() => {
    return safeOptions.filter((option) => !safeSelected.includes(option.value))
  }, [safeOptions, safeSelected])

  // Get the selected items with their full option data
  const selectedItems = React.useMemo(() => {
    return safeSelected
      .map((value) => safeOptions.find((o) => o.value === value))
      .filter((option): option is Option => option !== undefined)
  }, [safeOptions, safeSelected])

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selectedItems.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="hover:bg-secondary"
            >
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selectedItems.length === 0 ? placeholder : undefined}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-[200px]">
              {selectables.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </CommandEmpty>
              ) : (
                selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue("")
                      onChange([...safeSelected, option.value])
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}