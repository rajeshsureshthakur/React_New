import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const SelectContext = React.createContext(undefined);

const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = React.useState(false);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      value,
      onValueChange: (newValue) => {
        onValueChange?.(newValue);
        setOpen(false);
      },
    }),
    [open, value, onValueChange]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
};

const SelectTrigger = React.forwardRef(
  ({ className, children, disabled, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, options }) => {
  const { value } = useSelectContext();
  const selected = options?.find(opt => opt.value === value);
  return <span>{selected ? selected.label : placeholder}</span>;
};

const SelectContent = ({ className, children, ...props }) => {
  const { open, setOpen } = useSelectContext();
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg animate-slide-down",
        className
      )}
      {...props}
    >
      <div className="p-1 max-h-[300px] overflow-y-auto">{children}</div>
    </div>
  );
};
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(
  ({ className, children, value, ...props }, ref) => {
    const { onValueChange } = useSelectContext();

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
