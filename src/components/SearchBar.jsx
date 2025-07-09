import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>

        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Cari berdasarkan nama, NIK, atau alamat..." className="form-control" />

        {keyword && (
          <button type="button" onClick={handleClear} className="btn btn-outline-secondary">
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
