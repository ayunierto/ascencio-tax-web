'use client';

import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  className,
}: MultiSelectProps) {
  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      handleUnselect(value);
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-wrap gap-1 mb-2">
        {selected.map((value) => {
          const option = options.find((o) => o.value === value);
          if (!option) return null;

          return (
            <Badge
              key={value}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {option.label}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnselect(value);
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          );
        })}
      </div>

      <div className="relative">
        <select
          multiple
          value={selected}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value,
            );
            onChange(selectedOptions);
          }}
          disabled={disabled}
          className="w-full min-h-25 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="py-1.5 px-2 cursor-pointer hover:bg-accent"
            >
              {option.label}
            </option>
          ))}
        </select>
        {!selected.length && (
          <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-sm text-muted-foreground">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
