import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INDIAN_LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Assamese",
  "Urdu",
  "Sanskrit",
  "Konkani",
  "Manipuri",
  "Nepali",
  "Bodo",
  "Dogri",
  "Kashmiri",
  "Maithili",
  "Santali",
  "Sindhi",
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-base">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-popover">
        {INDIAN_LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang} className="cursor-pointer">
            {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};