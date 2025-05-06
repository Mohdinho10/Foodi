const serviceLists = [
  {
    id: 1,
    title: "Catering",
    des: "Delight your guests with our flavors and  presentation",
    img: "/images/home/services/icon1.png",
  },
  {
    id: 2,
    title: "Fast delivery",
    des: "We deliver your order promptly to your door",
    img: "/images/home/services/icon2.png",
  },
  {
    id: 3,
    title: "Online Ordering",
    des: "Explore menu & order with ease using our Online Ordering n",
    img: "/images/home/services/icon3.png",
  },
  {
    id: 4,
    title: "Gift Cards",
    des: "Give the gift of exceptional dining with Foodi Gift Cards",
    img: "/images/home/services/icon4.png",
  },
];

const OurServices = () => {
  return (
    <div className="section-container my-16">
      <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
        <div className="md:w-1/2">
          <div className="text-left md:w-4/5">
            <p className="subtitle">Our Story & Services</p>
            <h2 className="title">Our Culinary Journey And Services</h2>
            <p className="text-secondary my-5 leading-[30px]">
              Rooted in passion, we curate unforgettable dining experiences and
              offer exceptional services, blending culinary artistry with warm
              hospitality.
            </p>

            <button className="bg-green btn rounded-full px-8 py-3 font-semibold text-white">
              Explore
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
            {serviceLists.map((service) => (
              <div
                key={service.id}
                className="text-green cursor-pointer space-y-2 rounded-sm px-4 py-5 text-center shadow-md transition-all duration-200 hover:border hover:border-indigo-600"
              >
                <img src={service.img} alt="" className="mx-auto" />
                <h5 className="pt-3 font-semibold"> {service.title}</h5>
                <p className="text-[#90BD95]">{service.des}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
