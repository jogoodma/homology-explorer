interface GeneSearchProps {
  onChange: (value: string) => void;
}
const GeneSearch = ({ onChange }: GeneSearchProps) => {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
  };

  return (
    <form>
      <label htmlFor="id" className="text-4xl text-gray-500">
        Enter a Gene:
      </label>
      <input
        id="gene"
        type="search"
        placeholder="e.g. KRAS"
        autoComplete="off"
        className="mt-4 form-input text-3xl px-4 py-3 rounded-full text-black w-full placeholder:text-slate-400"
        onChange={handleChange}
      />
    </form>
  );
};

export default GeneSearch;
