declare module "react-slick" {
  import * as React from "react";

  interface Settings {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    arrows?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    centerMode?: boolean;
    className?: string;
    dots?: boolean;
    draggable?: boolean;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: "ondemand" | "progressive";
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    pauseOnDotsHover?: boolean;
    responsive?: Array<any>;
    rows?: number;
    rtl?: boolean;
    slidesPerRow?: number;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    swipe?: boolean;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    variableWidth?: boolean;
    vertical?: boolean;
    waitForAnimate?: boolean;
    beforeChange?: (current: number, next: number) => void;
    afterChange?: (current: number) => void;
    asNavFor?: Slider | undefined;
    ref?: React.Ref<Slider>;
  }

  export default class Slider extends React.Component<Settings> {}
}
