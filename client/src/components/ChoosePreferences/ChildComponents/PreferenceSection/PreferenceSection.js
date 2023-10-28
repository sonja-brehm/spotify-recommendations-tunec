import { RangeSlider } from "../../../index.js";

const PreferenceSection = ({
  title,
  description,
  selectedMinValue,
  selectedMaxValue,
  onChange,
  sliderDescriptionLeft = "low",
  sliderDescriptionRight = "high",
}) => {
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
      <RangeSlider
        sliderDescriptionLeft={sliderDescriptionLeft}
        sliderDescriptionRight={sliderDescriptionRight}
        selectedMinValue={selectedMinValue}
        selectedMaxValue={selectedMaxValue}
        onChange={onChange}
      />
    </>
  );
};

export default PreferenceSection;
