import { Link } from "react-router-dom";
import bannerImg from "/images/home/banner.png";

const Banner = () => {
  return (
    <div className="container mx-auto max-w-screen-2xl bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100% xl:px-24">
      <div className="flex flex-col items-center justify-between gap-8 py-24 md:flex-row-reverse">
        {/* img */}
        <div className="md:w-1/2">
          <img src={bannerImg} alt="" />
          <div className="-mt-14 flex flex-col items-center justify-around gap-4 md:flex-row">
            <div className="flex w-64 items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
              <img
                src="/images/home/b-food1.png"
                alt=""
                className="rounded-2xl"
              />
              <div className="space-y-1">
                <h5>Spicy noodles</h5>
                <div className="rating rating-sm">
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    checked
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                </div>
                <p className="text-red">$18.00</p>
              </div>
            </div>
            <div className="hidden w-64 items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm md:flex">
              <img
                src="/images/home/b-food1.png"
                alt=""
                className="rounded-2xl"
              />
              <div className="space-y-1">
                <h5>Spicy noodles</h5>
                <div className="rating rating-sm">
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    checked
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                </div>
                <p className="text-red">$18.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* texts */}
        <div className="space-y-7 px-4 md:w-1/2">
          <h2 className="text-4xl font-bold leading-snug md:text-5xl md:leading-snug">
            Dive into Delights Of Delectable{" "}
            <span className="text-green">Food</span>
          </h2>
          <p className="text-xl text-[#4A4A4A]">
            Where Each Plate Weaves a Story of Culinary Mastery and Passionate
            Craftsmanship
          </p>
          <Link
            to={"/menu"}
            className="btn rounded-full bg-myGreen px-8 py-3 font-semibold text-white"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
