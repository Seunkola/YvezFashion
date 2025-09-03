"use client";

import * as React from "react";

type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
};

export function Slider({ min, max, step = 1, value, onValueChange }: SliderProps) {
  const handleChange = (index: 0 | 1, newVal: number) => {
    const updated: [number, number] =
      index === 0 ? [newVal, value[1]] : [value[0], newVal];
    onValueChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full">
        {/* Min range */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          className="slider-thumb-gold w-full appearance-none bg-transparent"
        />
        {/* Max range */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          className="slider-thumb-gold w-full appearance-none bg-transparent"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>₦{value[0].toLocaleString()}</span>
        <span>₦{value[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
