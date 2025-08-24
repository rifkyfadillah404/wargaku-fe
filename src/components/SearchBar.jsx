import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari berdasarkan nama, NIK, atau alamat..."
          className="pl-10"
        />
      </div>
      {keyword && (
        <Button type="button" onClick={handleClear} variant="outline" size="icon">
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
