import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import {
  Overlay,
  Header,
  CloseBtn,
  SlickWrapper,
  ImgWrapper,
  Indicator,
  Global,
} from "./styles";

/**
 * npm i react-slick
 */
const ImagesZoom = ({ image, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const BACKEND_URL = "http://3.95.136.155:4000/";

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {image.map((item) => (
              <ImgWrapper key={item.src}>
                <img src={`${BACKEND_URL}${item.src}`} alt={item.src} />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} /{image.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  image: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
