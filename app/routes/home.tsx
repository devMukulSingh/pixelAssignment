import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Route } from "./+types/home";
import { Search } from "lucide-react";
import { items } from "~/lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex justify-center gap-5 items-center py-20  h-screen w-full">
      <div
        className="
      border-neutral-300 
      px-5 
      py-4
      rounded-md
      space-y-2
      border-2

      "
      >
        <h1>Items you can search for : </h1>
        <ul className="list-disc px-5">
          {items.map((item, index) => (
            <li className="text-sm" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Combobox />
    </div>
  );
}

function Combobox() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(true);

  //debouncing
  useEffect(() => {
    if (isOpenDropdown) {
      const debounced = setTimeout(() => {
        handleChange();
      }, 800);
      return () => clearTimeout(debounced);
    }
  }, [inputValue]);

  function handleChange() {
    console.log("inside");
    const query = inputValue.toLowerCase();
    if (!query || query === "") return setSuggestions([]);

    const filtered = items.filter((item) => item.toLowerCase().includes(query));
    setSuggestions(filtered);
  }
  // logic for moving up and down in suggestions using keyboard keys
  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        if (suggestions?.length === focusedIndex + 1) {
          setFocusedIndex(0);
          return;
        }
        setFocusedIndex((prev) => prev + 1);
        break;
      case "ArrowUp":
        if (focusedIndex === 0 && suggestions) {
          setFocusedIndex(suggestions.length - 1);
          return;
        }
        setFocusedIndex((prev) => prev - 1);
        break;
      case "Escape":
        setFocusedIndex(0);
        setIsOpenDropdown(false);
        inputRef.current?.blur();
      case "Enter":
        setInputValue(suggestions[focusedIndex]);
        setIsOpenDropdown(false);
        inputRef.current?.blur();
        break;
    }
  }
  return (
    <div
      className="
    flex 
    gap-1
    w-[18rem]
    flex-col
    "
    >
      <div
        className="
      flex
      gap-1
      items-center
      rounded-md
      focus:ring
      focus:ring-neutral-500
      focus:outline-none
      focus:border-none
      shadow-lg
      w-full
      border
      border-neutral-300
      px-3 
      py-2
      "
      >
        <Search />
        <input
          onFocus={() => setIsOpenDropdown(true)}
          ref={inputRef}
          value={inputValue}
          onKeyUp={handleKeyUp}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Search"
          className="
          placeholder:text-sm
          focus:outline-none
          w-full
          px-5
      "
        />
      </div>
      {isOpenDropdown && suggestions?.length > 0 ? (
        <Suggestions
          setIsOpenDropdown={setIsOpenDropdown}
          focusedIndex={focusedIndex}
          setInputValue={setInputValue}
          suggestions={suggestions}
        />
      ) : null}
      {inputValue !== "" && suggestions?.length === 0 ? (
        <h1>No result found</h1>
      ) : null}
    </div>
  );
}

type SuggestionsProps = {
  suggestions: string[];
  setInputValue: Dispatch<SetStateAction<string>>;
  focusedIndex: number;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
};
function Suggestions({
  suggestions,
  setInputValue,
  setIsOpenDropdown,
  focusedIndex,
}: SuggestionsProps) {
  return (
    <div
      id="suggestions"
      className="
        overflow-auto
        rounded-md
        max-h-[20rem]
        px-2
        py-2
        border
        border-neutral-300
        shadow-md
      
      "
    >
      {suggestions?.map((item, index) => (
        <Suggestion
          isFocused={focusedIndex === index}
          setInputValue={setInputValue}
          item={item}
          key={index}
          setIsOpenDropdown={setIsOpenDropdown}
        />
      ))}
    </div>
  );
}

type Props = {
  item: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isFocused: boolean;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
};

function Suggestion({
  item,
  setInputValue,
  isFocused,
  setIsOpenDropdown,
}: Props) {
  function handleSelect() {
    setInputValue(item);
    setIsOpenDropdown(false);
  }
  return (
    <div
      onClick={handleSelect}
      style={
        isFocused
          ? {
              backgroundColor: "#dadada",
            }
          : {}
      }
      className="hover:bg-neutral-200 focus:bg-neutral-200  rounded-md cursor-pointer px-2 py-1"
    >
      {item}
    </div>
  );
}
