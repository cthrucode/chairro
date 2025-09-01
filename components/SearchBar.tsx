'use client'

type SearchBarProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-black"
    />
  )
}
