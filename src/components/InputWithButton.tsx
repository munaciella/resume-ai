import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export function InputWithButton({ value, onChange, onClear }: Props) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        variant="secondary"
        onClick={onClear}
        type="button"
        className="shrink-0"
      >
        Clear
      </Button>
    </div>
  );
}
