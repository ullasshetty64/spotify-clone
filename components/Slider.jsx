"use client";

import * as RadixSlider from "@radix-ui/react-slider";

const Slider = ({ 
  value = 1, 
  onChange, 
  max = 1 
}) => {
  const handleChange = (newValue) => {
    onChange?.(newValue[0]);
  };

  return ( 
    <RadixSlider.Root 
      className="relative flex items-center select-none touch-none w-full h-10 cursor-pointer" 
      defaultValue={[0]} 
      value={[value]} 
      onValueChange={handleChange} 
      max={max || 1} // FIX: Never let max be 0, default to 1 to prevent layout bugs
      step={0.1} 
      aria-label="Volume"
    >
      <RadixSlider.Track 
        className="bg-neutral-600 relative grow rounded-full h-[3px]"
      >
        <RadixSlider.Range 
          className="absolute bg-white rounded-full h-full" 
        />
      </RadixSlider.Track>
      {/* Thumb makes it easier to drag */}
      <RadixSlider.Thumb 
        className="block w-3 h-3 bg-white rounded-[10px] shadow-md hover:scale-125 focus:outline-none transition" 
        aria-label="Volume" 
      />
    </RadixSlider.Root>
   );
}
 
export default Slider;