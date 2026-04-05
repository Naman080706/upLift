const fs = require('fs');
const path = require('path');
const p = path.resolve('./src/app/analysis/report/page.tsx');
let str = fs.readFileSync(p, 'utf8');

const reps = {
  'text-gray-400': 'text-[#9CA3AF]',
  'text-gray-500': 'text-[#6B7280]',
  'text-gray-600': 'text-[#4B5563]',
  'text-gray-800': 'text-[#1F2937]',
  'text-gray-900': 'text-[#111827]',
  'border-gray-200': 'border-[#E5E7EB]',
  'bg-gray-50': 'bg-[#F9FAFB]',
  'bg-gray-200': 'bg-[#E5E7EB]',
  'bg-yellow-50': 'bg-[#FEFCE8]',
  'text-yellow-800': 'text-[#854D0E]',
  'border-yellow-200': 'border-[#FEF08A]',
  'text-red-400': 'text-[#F87171]',
  'text-red-500': 'text-[#EF4444]',
  'text-red-600': 'text-[#DC2626]',
  'text-black': 'text-[#000]',
  'border-black': 'border-[#000]'
};

Object.keys(reps).forEach(k => {
  str = str.split(k).join(reps[k]);
});

str = str.replace(
  '<div className="text-lg font-bold">upLIFT Engine</div>', 
  '<img src="/uplift_lightmode_logo.png" className="h-8 object-contain object-right" alt="upLIFT" />'
);

// We should also replace the original NavLogo since we want the actual uplift logo
str = str.replace(
  '<div className="scale-125 origin-left mb-2 brightness-0"><NavLogo /></div>',
  '<div className="mb-2 font-black text-2xl text-[#FC0B0B]">upLIFT</div>'
);

fs.writeFileSync(p, str);
console.log("Done");
