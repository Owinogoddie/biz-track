import * as React from "react"
import { X, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { Input } from "@/components/ui/input"

type Option = {
  label: string
  value: string
}

interface MultiSelectWithCreateProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  onCreateNew: (value: string) => Promise<void>
  placeholder?: string
}

export function MultiSelectWithCreate({ 
  options, 
  value, 
  onChange, 
  onCreateNew,
  placeholder = "Select items..." 
}: MultiSelectWithCreateProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const selectedOptions = options.filter((option) => value.includes(option.value))

  const handleUnselect = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue))
  }

  const handleCreateNew = async () => {
    if (!inputValue.trim()) return
    setIsCreating(true)
    try {
      await onCreateNew(inputValue)
      setInputValue("")
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          const newSelected = [...value]
          newSelected.pop()
          onChange(newSelected)
        }
      }
      if (e.key === "Enter" && inputValue && !options.find(opt => opt.label.toLowerCase() === inputValue.toLowerCase())) {
        e.preventDefault()
        handleCreateNew()
      }
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }

  const selectables = options.filter((option) => !value.includes(option.value))
  const showCreateOption = inputValue && !options.find(opt => 
    opt.label.toLowerCase() === inputValue.toLowerCase()
  )

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selectedOptions.map((option) => {
            return (
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
                      handleUnselect(option.value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option.value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (selectables.length > 0 || showCreateOption) ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue("")
                      onChange([...value, option.value])
                    }}
                    className={"cursor-pointer"}
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0 data-[selected]:opacity-100" />
                    {option.label}
                  </CommandItem>
                )
              })}
              {showCreateOption && (
                <CommandItem
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onSelect={handleCreateNew}
                  className="cursor-pointer"
                  disabled={isCreating}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{inputValue}"
                </CommandItem>
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
