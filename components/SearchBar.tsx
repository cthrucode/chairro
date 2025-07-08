export default function SearchBar({ value, onChange }) {
    return (
      <input
        type="text"
        placeholder="Search..."
        className="w-full border p-2 rounded-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  