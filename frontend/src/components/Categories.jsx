const categoryItems = [
  {
    id: 1,
    title: "Main Dish",
    description: "(86 dishes)",
    image: "/images/home/category/img1.png",
  },
  {
    id: 2,
    title: "Break Fast",
    description: "(12 break fast)",
    image: "/images/home/category/img2.png",
  },
  {
    id: 3,
    title: "Dessert",
    description: "(48 dessert)",
    image: "/images/home/category/img3.png",
  },
  {
    id: 4,
    title: "Browse All",
    description: "(255 Items)",
    image: "/images/home/category/img4.png",
  },
];

const Categories = () => {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 xl:px-24">
      <div className="text-center">
        <p className="subtitle">Customer Favorites</p>
        <h2 className="title">Popular Categories</h2>
      </div>

      {/* category cards */}
      <div className="mt-12 flex flex-col flex-wrap items-center justify-around gap-8 sm:flex-row">
        {categoryItems.map((item, i) => (
          <div
            key={i}
            className="z-10 mx-auto w-72 cursor-pointer rounded-md bg-white px-5 py-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-4"
          >
            <div className="mx-auto flex w-full items-center justify-center">
              <img
                src={item.image}
                alt=""
                className="h-28 w-28 rounded-full bg-[#C1F1C6] p-5"
              />
            </div>
            <div className="mt-5 space-y-1">
              <h5 className="font-semibold text-[#1E1E1E]">{item.title}</h5>
              <p className="text-sm text-secondary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
