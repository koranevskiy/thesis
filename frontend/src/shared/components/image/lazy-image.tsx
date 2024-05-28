import { LazyLoadImage, LazyLoadImageProps } from "react-lazy-load-image-component";
import { FC } from "react";

export const LazyImage: FC<LazyImage> = ({ src, ...rest }) => {
  return <LazyLoadImage src={src} {...rest} />;
};

type LazyImage = LazyLoadImageProps & {
  src: string;
};
