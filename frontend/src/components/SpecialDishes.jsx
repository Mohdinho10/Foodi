import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import Cards from "./Cards";
import { useGetPopularDishesQuery } from "../slices/menuApiSlice";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      NEXT
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      BACK
    </div>
  );
};

const SpecialDishes = () => {
  const slider = useRef(null);
  const { data: recipes = [], isLoading, isError } = useGetPopularDishesQuery();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 970, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="container relative mx-auto my-20 max-w-screen-2xl px-4 xl:px-24">
      <div className="text-left">
        <p className="subtitle">Customer Favorites</p>
        <h2 className="title">Popular Categories</h2>
      </div>

      <div className="right-3 top-8 mb-10 md:absolute md:mr-24">
        <button
          onClick={() => slider.current?.slickPrev()}
          className="btn ml-5 rounded-full bg-green p-2"
        >
          <FaAngleLeft className="h-8 w-8 p-1" />
        </button>
        <button
          onClick={() => slider.current?.slickNext()}
          className="btn ml-5 rounded-full bg-green p-2"
        >
          <FaAngleRight className="h-8 w-8 p-1" />
        </button>
      </div>

      {isLoading ? (
        <p>Loading popular dishes...</p>
      ) : isError ? (
        <p>Failed to load dishes.</p>
      ) : (
        <Slider
          ref={slider}
          {...settings}
          className="mt-10 space-x-5 overflow-hidden"
        >
          {recipes.map((item, i) => (
            <Cards item={item} key={i} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default SpecialDishes;
