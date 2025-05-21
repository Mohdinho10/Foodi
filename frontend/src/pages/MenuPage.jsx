import { useState, useCallback } from "react";
import Cards from "../components/Cards";
import { FaFilter } from "react-icons/fa";
import { useGetMenuItemsQuery } from "../slices/menuApiSlice";
import debounce from "lodash/debounce";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const { data, isLoading, isError } = useGetMenuItemsQuery({
    page: currentPage,
    pageSize: itemsPerPage,
    category: selectedCategory,
    sort: mapSortOption(sortOption),
    search: searchText,
  });

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  // Sort mapping: frontend option → backend sort param
  function mapSortOption(option) {
    switch (option) {
      case "A-Z":
        return "name-asc";
      case "Z-A":
        return "name-desc";
      case "low-to-high":
        return "price-asc";
      case "high-to-low":
        return "price-desc";
      default:
        return "default";
    }
  }

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category === "all" ? "" : category);
    setCurrentPage(1);
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  // Debounced search input
  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchText(value);
      setCurrentPage(1);
    }, 300),
    [],
  );

  if (isLoading) return <p className="py-10 text-center">Loading menu...</p>;
  if (isError)
    return (
      <p className="py-10 text-center text-red-500">Error loading menu items</p>
    );

  return (
    <div>
      {/* Banner */}
      <div className="container mx-auto max-w-screen-2xl bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC] px-4 xl:px-24">
        <div className="flex flex-col items-center justify-center py-48">
          <div className="space-y-7 px-4 text-center">
            <h2 className="text-4xl font-bold leading-snug md:text-5xl">
              For the Love of Delicious{" "}
              <span className="text-myGreen">Food</span>
            </h2>
            <p className="mx-auto text-xl text-[#4A4A4A] md:w-4/5">
              Come with family & feel the joy of mouthwatering food...
            </p>
            <button className="btn rounded-full bg-myGreen px-8 py-3 font-semibold text-white">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Search, Filter and Sort */}
      <div className="section-container">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category buttons */}
          <div className="flex flex-wrap gap-2">
            {["all", "salad", "pizza", "soup", "dessert", "drinks"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`capitalize ${
                    selectedCategory === cat ||
                    (cat === "all" && selectedCategory === "")
                      ? "active"
                      : ""
                  }`}
                >
                  {cat}
                </button>
              ),
            )}
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search items..."
            className="input-bordered input w-full max-w-xs focus:outline-none"
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {/* Sort dropdown */}
          <div className="flex items-center">
            <div className="mr-2 bg-black p-2">
              <FaFilter className="h-4 w-4 text-white" />
            </div>
            <select
              id="sort"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
              className="rounded-sm bg-black px-2 py-1 text-white"
            >
              <option value="default">Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {items.map((item, index) => (
            <Cards key={item._id || index} item={item} />
          ))}
        </div>

        {/* Pagination */}
        <div className="my-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 rounded-full px-3 py-1 ${
                currentPage === i + 1 ? "bg-myGreen text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
