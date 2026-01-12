import React from "react";

type BannerProps = {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
};

const Banner: React.FC<BannerProps> = ({
  image,
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div
      className="w-full h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-start"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div
        className="
          mr-4 md:mr-16
          bg-black/60
          p-4 md:p-8
          text-white
          text-right
          max-w-xs md:max-w-md
          rounded-lg
        "
      >
        <h1 className="text-base md:text-3xl font-bold mb-2">
          {title}
        </h1>

        <p className="text-sm md:text-sm mb-4">
          {description}
        </p>

        <button
          onClick={onButtonClick}
          className="
            bg-white
            hover:bg-white
            text-[#004080]
            px-4 py-2
            rounded
            hover:shadow-lg
            transition
          "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
