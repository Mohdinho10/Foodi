import { useState, useEffect } from "react";
import Cards from "../components/Cards";
import { FaFilter } from "react-icons/fa";
import { useGetMenuItemsQuery } from "../slices/menuApiSlice";

const Menu = () => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const { data: menu = [], isLoading, isError } = useGetMenuItemsQuery();

  useEffect(() => {
    if (menu.length > 0) {
      setFilteredItems(menu);
    }
  }, [menu]);

  const filterItems = (category) => {
    const filtered =
      category === "all"
        ? menu
        : menu.filter((item) => item.category === category);

    setFilteredItems(filtered);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const showAll = () => {
    setFilteredItems(menu);
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedItems = [...filteredItems];

    switch (option) {
      case "A-Z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredItems(sortedItems);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              For the Love of Delicious <span className="text-green">Food</span>
            </h2>
            <p className="mx-auto text-xl text-[#4A4A4A] md:w-4/5">
              Come with family & feel the joy of mouthwatering food...
            </p>
            <button className="bg-green btn rounded-full px-8 py-3 font-semibold text-white">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Sort UI */}
      <div className="section-container">
        <div className="mb-8 flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-wrap gap-4">
            {["all", "salad", "pizza", "soup", "dessert", "drinks"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => (cat === "all" ? showAll() : filterItems(cat))}
                  className={selectedCategory === cat ? "active" : ""}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center">
            <div className="bg-black p-2">
              <FaFilter className="h-4 w-4 text-white" />
            </div>
            <select
              id="sort"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
              className="rounded-sm bg-black px-2 py-1 text-white"
            >
              <option value="default"> Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {currentItems.map((item, index) => (
            <Cards key={index} item={item} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="my-8 flex flex-wrap justify-center gap-2">
        {Array.from({
          length: Math.ceil(filteredItems.length / itemsPerPage),
        }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 rounded-full px-3 py-1 ${
              currentPage === i + 1 ? "bg-green text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
