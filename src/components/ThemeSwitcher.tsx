
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from '@/contexts/ThemeContext';
import { Circle } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="absolute top-4 right-4 z-20">
      <ToggleGroup type="single" value={theme} onValueChange={(value) => {
        if (value) setTheme(value as any);
      }}>
        <ToggleGroupItem value="default" aria-label="Default Theme" className="p-2">
          <Circle className="text-[#00ff00]" />
        </ToggleGroupItem>
        <ToggleGroupItem value="blue" aria-label="Blue Theme" className="p-2">
          <Circle className="text-[#0EA5E9]" />
        </ToggleGroupItem>
        <ToggleGroupItem value="purple" aria-label="Purple Theme" className="p-2">
          <Circle className="text-[#8B5CF6]" />
        </ToggleGroupItem>
        <ToggleGroupItem value="red" aria-label="Red Theme" className="p-2">
          <Circle className="text-[#EA384C]" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeSwitcher;
